import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  PlayCircleIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  src: string;
  trailerSrc?: string;
  className?: string;
}

interface VideoPlayerRef {
  toggleFullscreen: () => Promise<void>;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, trailerSrc, className = "" }, ref) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlayable, setIsPlayable] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isTrailerLoading, setIsTrailerLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const trailerVideoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const mainVideo = videoRef.current;
      const trailerVideo = trailerVideoRef.current;

      const handleTimeUpdate = () => {
        const currentVideo = isFullscreen ? trailerVideo : mainVideo;
        if (currentVideo) {
          setProgress((currentVideo.currentTime / currentVideo.duration) * 100);
        }
      };

      const handleLoadedMetadata = () => {
        setIsLoaded(true);
      };

      const handleCanPlay = () => {
        setIsPlayable(true);
      };

      // Add listeners to both videos
      if (mainVideo) {
        mainVideo.addEventListener("timeupdate", handleTimeUpdate);
        mainVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
        mainVideo.addEventListener("canplay", handleCanPlay);
      }

      if (trailerVideo) {
        trailerVideo.addEventListener("timeupdate", handleTimeUpdate);
        trailerVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
        trailerVideo.addEventListener("canplay", handleCanPlay);
      }

      return () => {
        if (mainVideo) {
          mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
          mainVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
          mainVideo.removeEventListener("canplay", handleCanPlay);
        }
        if (trailerVideo) {
          trailerVideo.removeEventListener("timeupdate", handleTimeUpdate);
          trailerVideo.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          trailerVideo.removeEventListener("canplay", handleCanPlay);
        }
      };
    }, [isFullscreen]);

    useImperativeHandle(ref, () => ({
      toggleFullscreen,
    }));

    const togglePlay = () => {
      const currentVideo = isFullscreen
        ? trailerVideoRef.current
        : videoRef.current;
      if (!currentVideo) return;

      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play();
      }
      setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
      const currentVideo = isFullscreen
        ? trailerVideoRef.current
        : videoRef.current;
      if (!currentVideo) return;
      currentVideo.muted = !currentVideo.muted;
      setIsMuted(!isMuted);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const currentVideo = isFullscreen
        ? trailerVideoRef.current
        : videoRef.current;
      if (!currentVideo) return;

      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const width = bounds.width;
      const percentage = (x / width) * 100;
      const newTime = (percentage / 100) * currentVideo.duration;

      currentVideo.currentTime = newTime;
      setProgress(percentage);
    };

    const toggleFullscreen = async () => {
      if (!containerRef.current) return;

      if (!document.fullscreenElement) {
        setIsTrailerLoading(true);
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);

        if (trailerVideoRef.current && trailerSrc) {
          trailerVideoRef.current.muted = false;
          setIsMuted(false);
          // Only set src if it hasn't been set yet
          if (!trailerVideoRef.current.src.includes(trailerSrc)) {
            trailerVideoRef.current.src = trailerSrc;
            await trailerVideoRef.current.load();
          }

          try {
            await trailerVideoRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error("Error playing trailer video:", error);
          }

          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
        setIsTrailerLoading(false);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);

        if (videoRef.current && trailerVideoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          trailerVideoRef.current.pause();

          try {
            await videoRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error("Error playing main video:", error);
          }
        }
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const getCurrentTime = () => {
      const currentVideo = isFullscreen
        ? trailerVideoRef.current
        : videoRef.current;
      return currentVideo?.currentTime || 0;
    };

    const getCurrentDuration = () => {
      const currentVideo = isFullscreen
        ? trailerVideoRef.current
        : videoRef.current;
      return currentVideo?.duration || 0;
    };

    return (
      <motion.div
        ref={containerRef}
        className={`relative overflow-hidden ${className} ${
          isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
        }`}
        layout
        layoutId="video-container"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 1.2,
        }}
      >
        {/* Main looping video */}
        <motion.video
          ref={videoRef}
          className={`w-full h-full object-cover ${
            isFullscreen ? "hidden" : ""
          }`}
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

        {/* Trailer video for fullscreen */}
        <motion.video
          ref={trailerVideoRef}
          className={`w-full h-full object-cover ${
            !isFullscreen ? "hidden" : ""
          }`}
          playsInline
          preload="metadata"
          layout
        >
          <source src={trailerSrc} type="video/mp4" />
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
                y: { type: "spring", stiffness: 300, damping: 25 },
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(isPlayable && isLoaded) ? toggleFullscreen : undefined}
                  className={`p-5 rounded-full bg-white/5 hover:${
                    (isPlayable && isLoaded) ? "bg-white/10" : "bg-white/5"
                  } transition-colors backdrop-blur-xs absolute z-50 ${
                    (isPlayable && isLoaded) ? "cursor-pointer" : "cursor-default"
                  } relative`}
                  disabled={!(isPlayable && isLoaded)}
                >
                  <div
                    className={`absolute inset-0 rounded-full border-2 border-white/30 border-t-white/90 ${
                      !isPlayable || !isLoaded || isTrailerLoading
                        ? "animate-spin"
                        : "hidden"
                    }`}
                  />
                  <PlayCircleIcon
                    size={32}
                    className="text-white relative z-10"
                  />
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
                y: { type: "spring", stiffness: 300, damping: 30 },
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
                      {formatTime(getCurrentTime())} /{" "}
                      {formatTime(getCurrentDuration())}
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
  }
);

export default VideoPlayer;
