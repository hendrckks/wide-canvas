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
      className="h-full py-28 md:py-40 flex flex-col justify-center items-center text-center text-white text-4xl sm:text-6xl lg:text-8xl bg-black"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.p className="max-w-[90vw] md:max-w-[70vw] line-clamp-4 leading-tight md:leading-[88px] tracking-tighter px-4 md:px-0">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Making Memories &
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            putting them in a
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-[#ff6017] italic"
          >
            ~ Wide Canvas ~
          </motion.span>
        </motion.p>
      </motion.div>
      <motion.p
        className="text-base sm:text-lg mb-2 text-white/80 font-medium mt-6 md:mt-9 h-fit px-4 md:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Freelance photographer and cinematographer based in Kenya
      </motion.p>
      <div className="mt-6 md:mt-9 flex flex-col sm:flex-row gap-4 sm:gap-8 leading-3.5 px-4 md:px-0">
        <Link
          to="/contact"
          className="text-xs flex items-center px-6 sm:px-8 py-2 font-medium rounded-full border text-white hover:text-black border-white/40 relative overflow-hidden group transition-colors duration-200 hover:border-transparent cursor-pointer w-full sm:w-auto"
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
          className="text-xs px-6 sm:px-8 py-2 flex gap-2 items-center justify-center rounded-full border hover:border-white/80 hover:bg-transparent hover:text-white transition-colors duration-200 bg-white text-black cursor-pointer w-full sm:w-auto"
        >
          WATCH TRAILER
          <span>
            <ArrowUpRight size={16} className="sm:w-5 sm:h-5" />
          </span>
        </button>
      </div>
      <div className="my-8 md:my-12 w-full max-w-[90vw] md:max-w-[900px] aspect-[16/9] max-h-[675px]">
        <VideoPlayer
          ref={videoPlayerRef}
          src="/shotfilm.mp4"
          trailerSrc="/trailer.mp4"
          className="w-full h-full p-2"
        />
      </div>
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
