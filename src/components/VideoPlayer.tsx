import { Play, Pause, Maximize2, Minimize2, PlayCircleIcon, Volume2, VolumeX } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  className?: string;
}

interface VideoPlayerRef {
  toggleFullscreen: () => Promise<void>;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ src, thumbnail, className = "" }, ref) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    toggleFullscreen
  }));

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percentage = (x / width) * 100;
    const time = (percentage / 100) * duration;

    videoRef.current.currentTime = time;
    setProgress(percentage);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current || !videoRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className} ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}
      layout
      layoutId="video-container"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.05, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1.2
      }}
    >
      {!isLoaded && thumbnail && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 bg-gray-900"
        >
          <motion.img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            layout
          />
        </motion.div>
      )}
      <motion.video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        preload="auto"
        autoPlay
        loop
        muted
        layout
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      <AnimatePresence>
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              y: { type: "spring", stiffness: 300, damping: 25 }
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isLoaded ? toggleFullscreen : undefined}
                className={`p-5 rounded-full bg-white/5 hover:${isLoaded ? "bg-white/10" : "bg-white/5"} transition-colors backdrop-blur-xs absolute z-50 ${isLoaded ? "cursor-pointer" : "cursor-default"} relative`}
                disabled={!isLoaded}
              >
                <div className={`absolute inset-0 rounded-full border-2 border-white/30 border-t-white/90 ${!isLoaded ? "animate-spin" : "hidden"}`} />
                <PlayCircleIcon size={32} className="text-white relative z-10" />
              </motion.button>
            </div>
            <motion.div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/90" />
            <motion.div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/90" />
            <motion.div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/90" />
            <motion.div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/90" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              scale: { type: "spring", stiffness: 200, damping: 25 },
              y: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-all duration-500 ease-in-out"
          >
            <div className="p-4 space-y-2">
              <motion.div
                className="h-1 bg-white/30 rounded-full cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: `${progress}%` }}
                  layout
                />
              </motion.div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-white" />
                    ) : (
                      <Play size={20} className="text-white" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted ? (
                      <VolumeX size={20} className="text-white" />
                    ) : (
                      <Volume2 size={20} className="text-white" />
                    )}
                  </motion.button>
                  <span className="text-sm">
                    {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                    {formatTime(duration)}
                  </span>
                </div>

                <motion.button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isFullscreen ? (
                    <Minimize2 size={20} className="text-white" />
                  ) : (
                    <Maximize2 size={20} className="text-white" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default VideoPlayer;