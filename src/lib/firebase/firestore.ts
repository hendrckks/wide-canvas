import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { generateSlug, Project, ProjectSchema } from "../types/project";
import { uploadImage, deleteImage } from "./storage";
import { db } from "./clientApp.ts";

// Collection reference
const projectsCollection = collection(db, "projects");

// Cache for projects
const projectsCache: Map<string, Project> = new Map();
let lastFetchTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Subscribe to real-time updates
let unsubscribe: (() => void) | null = null;

// Initialize real-time listener
const initializeRealtimeUpdates = () => {
  if (unsubscribe) return;

  unsubscribe = onSnapshot(projectsCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const project = change.doc.data() as Project;
      if (change.type === "added" || change.type === "modified") {
        projectsCache.set(change.doc.id, project);
      } else if (change.type === "removed") {
        projectsCache.delete(change.doc.id);
      }
    });
  });
};

// Create a new project
export const createProject = async (project: Project): Promise<string> => {
  try {
    // Generate slug from project name
    const baseSlug = generateSlug(project.name);
    let slug = baseSlug;

    // Check if slug exists
    const querySnapshot = await getDocs(projectsCollection);
    const existingSlugs = new Set<string>();
    const slugRegex = new RegExp(`^${baseSlug}(-[0-9]+)?$`);
    let maxIncrement = 0;

    querySnapshot.forEach((doc) => {
      const projectData = doc.data() as Project;
      existingSlugs.add(projectData.slug);

      // Check for existing increments
      if (projectData.slug.match(slugRegex)) {
        const match = projectData.slug.match(/-(\d+)$/);
        if (match) {
          const increment = parseInt(match[1], 10);
          maxIncrement = Math.max(maxIncrement, increment);
        }
      }
    });

    // If slug exists, append increment
    if (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${maxIncrement + 1}`;
    }

    // Add slug to project data
    project.slug = slug;
    // Upload images first
    const imageUploadPromises = project.images.map(async (image, index) => {
      if (image.url.startsWith("data:") || image.url.startsWith("blob:")) {
        // Convert base64/blob URL to File object
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], `project-image-${index}.jpg`, {
          type: "image/jpeg",
        });

        // Upload to Firebase Storage
        const path = `projects/${Date.now()}-${file.name}`;
        const url = await uploadImage(file, path);
        return { ...image, url, path };
      }
      return image;
    });

    const uploadedImages = await Promise.all(imageUploadPromises);
    const projectWithUploadedImages = { ...project, images: uploadedImages };

    // Validate project data
    ProjectSchema.parse(projectWithUploadedImages);

    // Add to Firestore
    const docRef = await addDoc(projectsCollection, projectWithUploadedImages);
    projectsCache.set(docRef.id, projectWithUploadedImages);

    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Fetch all projects with caching
export const getProjects = async (): Promise<Map<string, Project>> => {
  // Initialize real-time updates if not already done
  initializeRealtimeUpdates();

  // Check if cache is valid
  if (lastFetchTimestamp && Date.now() - lastFetchTimestamp < CACHE_DURATION) {
    return projectsCache;
  }

  try {
    const snapshot = await getDocs(projectsCollection);
    projectsCache.clear();

    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Project
    }));

    // Sort projects by order field (higher numbers first)
    projects.sort((a, b) => (b.order || 0) - (a.order || 0));

    // Update cache with sorted projects
    projects.forEach(project => {
      const { id, ...projectData } = project;
      projectsCache.set(id, projectData);
    });

    lastFetchTimestamp = Date.now();
    return projectsCache;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  // Check cache first
  if (projectsCache.has(id)) {
    return projectsCache.get(id) || null;
  }

  try {
    const docRef = doc(projectsCollection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const project = docSnap.data() as Project;
      projectsCache.set(id, project);
      return project;
    }

    return null;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Update a project
export const updateProject = async (
  id: string,
  updatedProject: Project
): Promise<void> => {
  try {
    // Handle image updates
    const imageUpdatePromises = updatedProject.images.map(
      async (image, index) => {
        if (image.url.startsWith("data:") || image.url.startsWith("blob:")) {
          // Upload new image
          const response = await fetch(image.url);
          const blob = await response.blob();
          const file = new File([blob], `project-image-${index}.jpg`, {
            type: "image/jpeg",
          });
          const path = `projects/${Date.now()}-${file.name}`;
          const url = await uploadImage(file, path);
          return { ...image, url, path };
        }
        return image;
      }
    );

    const updatedImages = await Promise.all(imageUpdatePromises);
    const projectWithUpdatedImages = {
      ...updatedProject,
      images: updatedImages,
    };

    // Validate updated project data
    ProjectSchema.parse(projectWithUpdatedImages);

    // Update in Firestore
    const docRef = doc(projectsCollection, id);
    await updateDoc(docRef, projectWithUpdatedImages);
    projectsCache.set(id, projectWithUpdatedImages);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    // Get project data first to delete images
    const project = await getProjectById(id);
    if (project) {
      // Delete images from storage
      const deletePromises = project.images.map(async (image) => {
        if (image.url) {
          try {
            await deleteImage(image.url);
          } catch (error) {
            console.error(`Error deleting image: ${image.url}`, error);
          }
        }
      });
      await Promise.all(deletePromises);
    }

    // Delete from Firestore
    const docRef = doc(projectsCollection, id);
    await deleteDoc(docRef);
    projectsCache.delete(id);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Cleanup function
export const cleanup = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  projectsCache.clear();
  lastFetchTimestamp = null;
};
