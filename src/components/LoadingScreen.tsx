import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const videos = ["/shotfilm.mp4", "/trailer.mp4"];
    const videoProgress = new Map<string, number>();

    const preloadVideo = async (src: string) => {
      try {
        const response = await fetch(src, {
          headers: { Range: 'bytes=0-2000000' }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const reader = response.body?.getReader();
        const contentLength = +(response.headers.get('content-length') ?? 0);
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          receivedLength += value.length;
          const progress = (receivedLength / contentLength) * 100;
          videoProgress.set(src, progress);
          
          // Calculate total progress as average of all video progress
          const totalProgress = Array.from(videoProgress.values()).reduce((sum, curr) => sum + curr, 0) / videos.length;
          setProgress(Math.min(totalProgress, 99));
        }

        return true;
      } catch (error) {
        console.error('Error preloading video:', error);
        return false;
      }
    };

    // Load all videos in parallel
    Promise.all(videos.map(src => preloadVideo(src)))
      .then(() => {
        setProgress(100);
        setTimeout(() => onLoadingComplete(), 500);
      });

    return () => {
      // Cleanup if needed
    };
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 1, scaleY: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "bottom" }}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl text-white font-medium italic mb-8"
      >
        WIDE CANVAS
      </motion.h1>
      <div className="w-48 h-[2px] bg-white/20 relative overflow-hidden">
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
        className="text-white/60 text-sm mt-4"
      >
        {Math.round(progress)}%
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;