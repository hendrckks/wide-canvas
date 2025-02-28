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
  // Extract width from imageHeight if present, otherwise default to w-full
  const hasExplicitWidth = imageHeight.includes("w-");
  
  return (
    <div className={`${hasExplicitWidth ? '' : 'w-full'} ${className}`}>
      <motion.div
        className={`${hasExplicitWidth ? '' : 'w-full'} ${imageHeight} rounded-sm p-2 mb-2 relative overflow-hidden dark:bg-white/5 bg-black/5`}
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
      
      {/* Corner decorations to match the actual project cards */}
      <motion.div className="absolute -top-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 border-l-1 border-t-1 dark:border-white/30 border-black/30 opacity-30" />
      <motion.div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 border-r-1 border-t-1 dark:border-white/30 border-black/30 opacity-30" />
      <motion.div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 border-l-1 border-b-1 dark:border-white/30 border-black/30 opacity-30" />
      <motion.div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 border-r-1 border-b-1 dark:border-white/30 border-black/30 opacity-30" />
    </div>
  );
};

export default SkeletonLoader;