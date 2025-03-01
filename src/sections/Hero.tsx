import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { useRef, MouseEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLatestVideoByType } from "../lib/firebase/videoServices";

interface VideoPlayerRef {
  toggleFullscreen: () => Promise<void>;
}

const Hero = () => {
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null);
  const [trailerVideoUrl, setTrailerVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);

        // Fetch the intro video
        const introVideo = await getLatestVideoByType("intro");
        if (introVideo) {
          setIntroVideoUrl(introVideo.url);
        } else {
          // Fallback to local file if no video found
          setIntroVideoUrl("/shotfilm.mp4");
        }

        // Fetch the trailer video
        const trailerVideo = await getLatestVideoByType("trailer");
        if (trailerVideo) {
          setTrailerVideoUrl(trailerVideo.url);
        } else {
          // Fallback to local file if no video found
          setTrailerVideoUrl("/trailer.mp4");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos. Using local versions.");
        // Fallback to local files
        setIntroVideoUrl("/shotfilm.mp4");
        setTrailerVideoUrl("/trailer.mp4");
      } finally {
        setIsLoading(false);
      }
    };

    

    fetchVideos();
  }, []);

  const handleWatchTrailer = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    videoPlayerRef.current?.toggleFullscreen();
  };

  return (
    <div
      id="hero"
      className="h-full py-20 sm:py-24 md:py-28 lg:py-32 flex flex-col justify-center items-center text-center dark:text-white text-black text-4xl sm:text-5xl md:text-5xl lg:text-[74px] dark:bg-black bg-white"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[75vw] line-clamp-6 leading-[40px] sm:leading-relaxed md:leading-[60px] tracking-tighter px-3 sm:px-4 md:px-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            We're not just here to
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-sentient italic text-[42px] sm:text-[60px] md:text-[70px] lg:text-[82px] tracking-tighter font-light"
          >
            <span className="font-display text-[38px] sm:text-5xl md:text-[64px] lg:text-[74px] font-normal mr-2 sm:mr-4 not-italic">
              make
            </span>
            memories
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            we're here to put them <br />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              on a
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[#ff6017] font-clash text-[40px] sm:text-[60px] md:text-[70px] lg:text-[80px] leading-10 lg:leading-16 tracking-tighter italic"
          >
            ~ Widecanvas ~
          </motion.div>
        </motion.div>
        <motion.p
          className="text-sm sm:text-base md:text-lg mb-2 dark:text-white/80 text-black/80 font-medium mt-3 sm:mt-4 md:mt-8 h-fit px-3 sm:px-4 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Professional photography and cinematography studio based in Kenya
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-6 md:mt-9 flex gap-2 sm:gap-8 leading-3.5 px-4 md:px-0"
      >
        <Link
          to="/contact"
          className="text-xs shadow-2xl text-center hover:shadow-3xl hover:scale-[1.1] transform transition-all duration-350 flex items-center justify-center px-2 sm:px-8 py-2 font-medium rounded-full border text-white dark:bg-transparent bg-black hover:text-black dark:border-white/40 border-black/40 relative overflow-hidden group hover:border-transparent cursor-pointer w-full sm:w-auto dark:shadow-[0_4px_8px_rgba(255,255,255,0.1)]"
          style={{
            isolation: "isolate",
          }}
        >
          LET'S CREATE
          <span className="relative z-10 group-hover:text-black transition-colors duration-250"></span>
          <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
        </Link>
        <button
          onClick={handleWatchTrailer}
          className="text-xs shadow-2xl hover:backdrop-blur-3xl hover:scale-[1.1] transform transition-all duration-250 px-4 sm:px-8 py-2 flex gap-1 sm:gap-2 items-center justify-center rounded-full border dark:hover:border-white/80 border-black/80 relative overflow-hidden group hover:border-transparent bg-white text-black cursor-pointer w-full sm:w-auto dark:shadow-[0_4px_8px_rgba(255,255,255,0.1)]"
          style={{ isolation: "isolate" }}
        >
          <span className="relative z-10 group-hover:text-white w-full transition-colors duration-350 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap">
            WATCH TRAILER
            <ArrowUpRight
              size={10}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5"
            />
          </span>
          <span className="relative z-10 group-hover:text-black transition-colors duration-250"></span>
          <div className="absolute inset-0 bg-black -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="my-6 sm:my-8 md:my-12 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[900px] aspect-[16/9] max-h-[675px]"
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-lg">
            <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-white"></div>
          </div>
        ) : (
          <VideoPlayer
            ref={videoPlayerRef}
            src={introVideoUrl || ""}
            trailerSrc={trailerVideoUrl || ""}
            className="w-full h-full p-2"
          />
        )}
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </motion.div>
      <p className="text-white/80 text-xs mt-10 font-medium flex items-center">
        [
        <motion.span
          animate={{
            y: [-2, 4, -2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown size={16} />
        </motion.span>
        SCROLL TO EXPLORE ]
      </p>
    </div>
  );
};

export default Hero;
