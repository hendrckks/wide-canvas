import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";

interface VideoPlayerRef {
  toggleFullscreen: () => Promise<void>;
}

const Hero = () => {
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handleWatchTrailer = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    videoPlayerRef.current?.toggleFullscreen();
  };

  return (
    <div
      id="hero"
      className="h-full py-28 md:py-32 flex flex-col justify-center items-center text-center dark:text-white text-black text-4xl sm:text-6xl lg:text-[85px] dark:bg-black bg-white"
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
          className="max-w-[90vw] md:max-w-[75vw] line-clamp-6 leading-tight md:leading-[62px] tracking-tighter px-4 md:px-0"
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
            We're not just here to <br />
            make
            <span className="font-sentient italic ml-4 text-8xl tracking-tighter font-light">
              memories
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            we're here to put them <br />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
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
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[#ff6017] italic"
          >
            ~ Widecanvas ~
          </motion.div>
        </motion.div>
        <motion.p
          className="text-base sm:text-lg mb-2 dark:text-white/80 text-black/80 font-medium mt-6 md:mt-9 h-fit px-4 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1,
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
          delay: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-6 md:mt-9 flex flex-col sm:flex-row gap-4 sm:gap-8 leading-3.5 px-4 md:px-0"
      >
        <Link
          to="/contact"
          className="text-xs flex items-center px-6 sm:px-8 py-2 font-medium rounded-full border text-white dark:bg-transparent bg-black hover:text-black dark:border-white/40 border-black/40 relative overflow-hidden group transition-colors duration-200 hover:border-transparent cursor-pointer w-full sm:w-auto"
          style={{
            isolation: "isolate",
          }}
        >
          LET'S CREATE
          <span className="relative z-10 group-hover:text-black transition-colors duration-200"></span>
          <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
        </Link>
        <button
          onClick={handleWatchTrailer}
          className="text-xs px-6 sm:px-8 py-2 flex gap-2 items-center justify-center rounded-full border dark:hover:border-white/80 border-black/80 dark:hover:bg-transparent hover:bg-black hover:text-white transition-colors duration-200 bg-white text-black cursor-pointer w-full sm:w-auto"
        >
          WATCH TRAILER
          <span>
            <ArrowUpRight size={16} className="sm:w-5 sm:h-5" />
          </span>
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="my-8 md:my-12 w-full max-w-[90vw] md:max-w-[900px] aspect-[16/9] max-h-[675px]"
      >
        <VideoPlayer
          ref={videoPlayerRef}
          src="/shotfilm.mp4"
          trailerSrc="/trailer.mp4"
          className="w-full h-full p-2"
        />
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
