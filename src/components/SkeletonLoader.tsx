import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  className?: string;
  imageHeight?: string;
  showDetails?: boolean;
}

const SkeletonLoader = ({
  className = "",
  imageHeight = "h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]",
  showDetails = true,
}: SkeletonLoaderProps) => {
  return (
    <div className={`w-full ${className}`}>
      <motion.div
        className={`w-full ${imageHeight} rounded-sm p-2 mb-2 relative overflow-hidden dark:bg-white/5 bg-black/5`}
      >
        <motion.div
          className="absolute inset-0 dark:bg-gradient-to-r dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-gradient-to-r from-black/5 via-black/10 to-black/5"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        />
      </motion.div>

      {showDetails && (
        <div className="px-2 mb-2">
          <div className="flex gap-2 flex-wrap">
            <motion.div
              className="w-24 h-6 rounded-xl dark:bg-white/5 bg-black/5 mt-2 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 dark:bg-gradient-to-r dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-gradient-to-r from-black/5 via-black/10 to-black/5"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </motion.div>
            <motion.div
              className="w-32 h-6 rounded-xl dark:bg-white/5 bg-black/5 mt-2 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 dark:bg-gradient-to-r dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-gradient-to-r from-black/5 via-black/10 to-black/5"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <motion.div
              className="w-48 h-8 rounded-sm dark:bg-white/5 bg-black/5 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 dark:bg-gradient-to-r dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-gradient-to-r from-black/5 via-black/10 to-black/5"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </motion.div>
            <motion.div
              className="w-6 h-6 rounded-sm dark:bg-white/5 bg-black/5 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 dark:bg-gradient-to-r dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-gradient-to-r from-black/5 via-black/10 to-black/5"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkeletonLoader;