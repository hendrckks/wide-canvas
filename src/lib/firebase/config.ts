import { FirebaseOptions } from "firebase/app";
import { z } from "zod";

const configSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string({
    required_error: "Firebase API Key is required",
  }),
  VITE_FIREBASE_AUTH_DOMAIN: z.string({
    required_error: "Firebase Auth Domain is required",
  }),
  VITE_FIREBASE_PROJECT_ID: z.string({
    required_error: "Firebase Project ID is required",
  }),
  VITE_FIREBASE_STORAGE_BUCKET: z.string({
    required_error: "Firebase Storage Bucket is required",
  }),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string({
    required_error: "Firebase Messaging Sender ID is required",
  }),
  VITE_FIREBASE_APP_ID: z.string({
    required_error: "Firebase App ID is required",
  }),
  VITE_FIREBASE_MEASUREMENT_ID: z.string({
    required_error: "Firebase Measurement ID is required",
  }),
});

const result = configSchema.safeParse(import.meta.env);
if (!result.success) {
  console.error("Firebase configuration error:", result.error.format());
  throw new Error("Invalid Firebase configuration");
}

// Log successful configuration loading
console.log("Firebase API Key loaded successfully:", result.data.VITE_FIREBASE_API_KEY ? "[Present]" : "[Missing]");
console.log("Firebase configuration loaded successfully");

const config: FirebaseOptions = {
  apiKey: result.data.VITE_FIREBASE_API_KEY,
  authDomain: result.data.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: result.data.VITE_FIREBASE_PROJECT_ID,
  storageBucket: result.data.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: result.data.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: result.data.VITE_FIREBASE_APP_ID,
  measurementId: result.data.VITE_FIREBASE_MEASUREMENT_ID,
};

export const SESSION_DURATION = 30 * 60 * 1000;

export const firebaseConfig = config;
