import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "./clientApp";

// Collection reference
const videosCollection = collection(db, "videos");

export interface VideoData {
  id?: string;
  name: string;
  description?: string;
  url: string;
  storagePath: string;
  type: "intro" | "trailer" | "overlay" | "other";
  overlayPosition?: number; // Position for overlay videos (1, 2, 3, 4)
  createdAt: number;
  updatedAt: number;
}

// Upload a video to Firebase Storage
export const uploadVideo = async (
  file: File,
  type: "intro" | "trailer" | "overlay" | "other",
  overlayPosition?: number
): Promise<VideoData> => {
  try {
    // Create a unique file path
    const path = `videos/${type}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);

    // Upload the file
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Create metadata document in Firestore
    const videoData: VideoData = {
      name: file.name,
      description: "",
      url,
      storagePath: path,
      type,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Add overlay position if applicable
    if (type === "overlay" && overlayPosition !== undefined) {
      videoData.overlayPosition = overlayPosition;
    }

    // Add to Firestore with auto-generated ID
    const docRef = doc(videosCollection);
    await setDoc(docRef, videoData);

    return {
      ...videoData,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

// Delete a video from Storage and Firestore
export const deleteVideo = async (id: string): Promise<void> => {
  try {
    // Get video data to get the storage path
    const videoDoc = await getDoc(doc(videosCollection, id));
    if (!videoDoc.exists()) {
      throw new Error(`Video with ID ${id} not found`);
    }

    const videoData = videoDoc.data() as VideoData;

    // Delete from Storage
    const storageRef = ref(storage, videoData.storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    await deleteDoc(doc(videosCollection, id));
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

// Get all videos
export const getAllVideos = async (): Promise<VideoData[]> => {
  try {
    const snapshot = await getDocs(videosCollection);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as VideoData)
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

// Get videos by type
export const getVideosByType = async (
  type: "intro" | "trailer" | "overlay" | "other"
): Promise<VideoData[]> => {
  try {
    const snapshot = await getDocs(videosCollection);
    return snapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as VideoData)
      )
      .filter((video) => video.type === type);
  } catch (error) {
    console.error(`Error fetching ${type} videos:`, error);
    throw error;
  }
};

// Get overlay videos ordered by position
export const getOverlayVideos = async (): Promise<VideoData[]> => {
  try {
    const videos = await getVideosByType("overlay");
    // Sort by position, then by creation date (newest first) if position is the same
    return videos.sort((a, b) => {
      if (a.overlayPosition && b.overlayPosition) {
        return a.overlayPosition - b.overlayPosition;
      } else if (a.overlayPosition) {
        return -1;
      } else if (b.overlayPosition) {
        return 1;
      }
      return b.createdAt - a.createdAt;
    });
  } catch (error) {
    console.error("Error fetching overlay videos:", error);
    throw error;
  }
};

// Get overlay video by position
export const getOverlayVideoByPosition = async (
  position: number
): Promise<VideoData | null> => {
  try {
    const videos = await getVideosByType("overlay");
    const filtered = videos.filter((v) => v.overlayPosition === position);

    if (filtered.length === 0) {
      return null;
    }

    // Sort by creation date, newest first
    return filtered.sort((a, b) => b.createdAt - a.createdAt)[0];
  } catch (error) {
    console.error(
      `Error fetching overlay video at position ${position}:`,
      error
    );
    throw error;
  }
};

// Get the latest video of a specific type
export const getLatestVideoByType = async (
  type: "intro" | "trailer" | "overlay" | "other"
): Promise<VideoData | null> => {
  try {
    const videos = await getVideosByType(type);
    if (videos.length === 0) {
      return null;
    }

    // Sort by creation date, newest first
    return videos.sort((a, b) => b.createdAt - a.createdAt)[0];
  } catch (error) {
    console.error(`Error fetching latest ${type} video:`, error);
    throw error;
  }
};

// Update video metadata
export const updateVideoMetadata = async (
  id: string,
  updates: Partial<VideoData>
): Promise<void> => {
  try {
    const docRef = doc(videosCollection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating video metadata:", error);
    throw error;
  }
};
