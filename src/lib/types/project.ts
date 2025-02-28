import { z } from "zod";

// Define the Category enum
export const ProjectCategory = {
  CONCEPTUAL: "conceptual",
  DOCUMENTARY: "documentary",
  AERIAL_AND_DRONE: "aerial and drone",
  PRODUCT: "product",
  CORPORATE: "corporate",
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
  TRAVEL: "travel",
  WILDLIFE: "wildlife",
} as const;

// Define the Project Type enum
export const ProjectType = {
  COMMERCIAL: "commercial",
  PASSION_PROJECT: "passion project",
  COLLABORATION: "collaboration",
} as const;

// Define the Image structure
export const ImageSchema = z.object({
  url: z.string().url(),
  isPrimary: z.boolean(),
});

// Function to generate a URL-friendly slug
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Define the Project schema
export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  slug: z.string(),
  description: z.string().min(1, "Project description is required"),
  category: z.enum(Object.values(ProjectCategory) as [string, ...string[]], {
    required_error: "Project category is required",
  }),
  projectType: z.enum(Object.values(ProjectType) as [string, ...string[]], {
    required_error: "Project type is required",
  }),
  camera: z.array(z.string()).min(1, "At least one camera is required"),
  lenses: z.array(z.string()).min(1, "At least one lens is required"),
  otherDevices: z.array(z.string()).default([]),
  location: z.string().min(1, "Location is required"),
  client: z.string().optional(),
  time: z.date(),
  images: z.array(ImageSchema).min(1, "At least one image is required"),
});

// TypeScript type derived from the Zod schema
export type Project = z.infer<typeof ProjectSchema>;

// TypeScript type for the image structure
export type ProjectImage = z.infer<typeof ImageSchema>;

// Helper type for category values
export type ProjectCategory = typeof ProjectCategory[keyof typeof ProjectCategory];

// Helper type for project type values
export type ProjectType = typeof ProjectType[keyof typeof ProjectType];