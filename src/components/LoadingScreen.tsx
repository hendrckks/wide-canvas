import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  loadingProgress?: number; // Make this prop optional
}

const LoadingScreen = ({ onLoadingComplete, loadingProgress }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    // If loadingProgress is provided, use it instead of calculating internally
    if (loadingProgress !== undefined) {
      setProgress(loadingProgress);
      
      // When loadingProgress reaches 100, call onLoadingComplete after a short delay
      if (loadingProgress >= 100) {
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
      return;
    }
    
    // Define videos to preload - this should match all videos used in your app
    const videos = ["/shotfilm.mp4", "/trailer.mp4"];
    const videoProgress = new Map<string, number>();
    const videoPlayable = new Map<string, boolean>();

    // Create hidden video elements for each video to ensure they're cached
    const videoElements = videos.map((src) => {
      const video = document.createElement("video");
      video.style.display = "none";
      video.preload = "auto"; // Force preloading
      video.muted = true;
      video.playsInline = true;
      document.body.appendChild(video);
      return { src, element: video };
    });

    const preloadVideo = async (src: string) => {
      try {
        // Request a larger chunk to ensure smooth initial playback
        const response = await fetch(src, {
          headers: { Range: "bytes=0-2000000" }, // Increased to ~2MB
          cache: "force-cache", // Ensure browser caching
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const reader = response.body?.getReader();
        const contentLength = +(response.headers.get("content-length") ?? 0);
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          receivedLength += value.length;
          const progress = (receivedLength / contentLength) * 100;
          videoProgress.set(src, progress);

          // Calculate total progress as average of all video progress
          const totalProgress =
            Array.from(videoProgress.values()).reduce(
              (sum, curr) => sum + curr,
              0
            ) / videos.length;
          setProgress(Math.min(totalProgress, 99));
        }

        // Test if the video is playable
        await checkPlayable(src);
        return true;
      } catch (error) {
        console.error("Error preloading video:", error);
        return false;
      }
    };

    const checkPlayable = async (src: string) => {
      return new Promise<void>((resolve) => {
        // Find the pre-created video element
        const videoEl = videoElements.find((v) => v.src === src)?.element;
        if (!videoEl) {
          resolve();
          return;
        }

        const handleCanPlay = () => {
          videoPlayable.set(src, true);
          videoEl.removeEventListener("canplay", handleCanPlay);

          // Try to preload more by playing and immediately pausing
          videoEl
            .play()
            .then(() => {
              setTimeout(() => {
                videoEl.pause();
                videoEl.currentTime = 0;
              }, 100);
            })
            .catch((e) => console.warn("Cannot preplay:", e));

          resolve();
        };

        videoEl.addEventListener("canplay", handleCanPlay);
        videoEl.src = src;
        videoEl.load(); // Explicitly load the video

        // Add a timeout just in case
        setTimeout(() => {
          if (!videoPlayable.get(src)) {
            console.warn(
              `Video ${src} taking too long to be playable, continuing anyway`
            );
            videoPlayable.set(src, true);
            resolve();
          }
        }, 5000);
      });
    };

    // Load all videos in parallel
    Promise.all(videos.map((src) => preloadVideo(src))).then(() => {
      // Check if all videos are playable
      const allPlayable = videos.every((src) => videoPlayable.get(src));

      if (allPlayable) {
        console.log("All videos are playable!");
        setProgress(100);
        setTimeout(() => {
          onLoadingComplete();

          // Clean up the hidden video elements
          videoElements.forEach(({ element }) => {
            document.body.removeChild(element);
          });
        }, 500);
      } else {
        console.warn("Not all videos are playable, but continuing anyway");
        setProgress(100);
        setTimeout(() => {
          onLoadingComplete();

          // Clean up the hidden video elements
          videoElements.forEach(({ element }) => {
            document.body.removeChild(element);
          });
        }, 500);
      }
    });

    return () => {
      // Cleanup hidden video elements if component unmounts early
      videoElements.forEach(({ element }) => {
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      });
    };
  }, [onLoadingComplete, loadingProgress]);

  return (
    <motion.div
      initial={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 1, scaleY: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "bottom" }}
      className={`fixed inset-0 ${
        theme === "dark" ? "bg-black" : "bg-white"
      } z-50 flex flex-col items-center justify-center`}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-4xl md:text-6xl ${
          theme === "dark" ? "text-white" : "text-black"
        } font-medium italic mb-8`}
      >
        ~WIDECANVAS~
      </motion.h1>
      <div
        className={`w-48 h-[2px] ${
          theme === "dark" ? "bg-white/20" : "bg-black/20"
        } relative overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 bg-[#ff6017]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: "left" }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`${
          theme === "dark" ? "text-white/60" : "text-black/60"
        } text-sm mt-4`}
      >
        {Math.round(progress)}%
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
