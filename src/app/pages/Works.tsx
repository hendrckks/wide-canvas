import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getProjects } from "../../lib/firebase/firestore";
import { Project } from "../../lib/types/project";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../components/SkeletonLoader";

const Works = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blurAmount, setBlurAmount] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());

        // Enhanced image loading with caching
        await Promise.all(
          projectsArray.map(async (project) => {
            const primaryImage =
              project.images.find((img) => img.isPrimary) || project.images[0];
            if (primaryImage?.url) {
              try {
                const cache = await caches.open('project-images');
                const cachedResponse = await cache.match(primaryImage.url);

                if (!cachedResponse) {
                  const response = await fetch(primaryImage.url, {
                    method: 'GET',
                    cache: 'force-cache',
                    headers: {
                      'Cache-Control': 'max-age=31536000',
                    },
                  });

                  if (response.ok) {
                    await cache.put(primaryImage.url, response.clone());
                    // Also preload the image
                    const img = new Image();
                    img.src = primaryImage.url;
                  }
                }
              } catch (error) {
                console.error('Error caching image:', error);
                // Fallback to basic preloading if caching fails
                const img = new Image();
                img.src = primaryImage.url;
              }
            }
          })
        );

        setProjects(projectsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          const calculatedBlur = isIntersecting ? 0 : 7;
          setBlurAmount(calculatedBlur);
        });
      },
      {
        root: null,
        threshold: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0],
        rootMargin: "-100px 0px 0px 0px",
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigateToProject = (slug: string) => {
    // Force scroll to top before navigation
    window.scrollTo({ top: 0, behavior: "instant" });
    // Use setTimeout to ensure scroll happens before navigation
    setTimeout(() => {
      navigate(`/project/${slug}`);
    }, 150);
  };

  return (
    <div className="relative h-full dark:bg-black/5 bg-white/95 dark:backdrop-blur-none backdrop-blur-sm">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
        className="sticky top-0 h-screen flex flex-col items-center justify-between py-12 sm:py-16 md:py-20 text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic text-[#ff6017] tracking-tighter z-0 bg-black/5"
      >
        <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6">
          <div className="flex-1 flex items-center justify-center text-center">
            Selected Works
          </div>
          <p className="dark:text-white/80 text-black text-[10px] sm:text-xs font-medium flex items-center absolute bottom-8 sm:bottom-10 tracking-normal">
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
              <ArrowDown size={12} className="sm:w-4 sm:h-4" />
            </motion.span>
            KEEP SCROLLING ]
          </p>
        </div>
      </motion.div>
      <div
        ref={projectsRef}
        className="relative z-10 dark:bg-black/90 bg-white backdrop-blur-sm py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-5 lg:px-6 -mt-screen"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="group relative">
                    <SkeletonLoader 
                      imageHeight="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full"
                      className="w-full"
                    />
                  </div>
                </motion.div>
              ))
            : projects.map((project, index) => {
                const primaryImage =
                  project.images.find((img) => img.isPrimary) ||
                  project.images[0];
                return (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <motion.div
                      className="group relative cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleNavigateToProject(project.slug)}
                      onMouseEnter={async () => {
                        try {
                          const projectsMap = await getProjects();
                          const hoveredProject = Array.from(
                            projectsMap.values()
                          ).find((p) => p.slug === project.slug);
                          if (hoveredProject) {
                            // Prefetch all project images
                            hoveredProject.images.forEach((image) => {
                              const img = new Image();
                              img.src = image.url;
                            });
                          }
                        } catch (error) {
                          console.error("Error prefetching project:", error);
                        }
                      }}
                    >
                      <motion.div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-sm p-2 mb-2">
                        <motion.img
                          src={primaryImage.url}
                          alt={project.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                          initial={{ opacity: 0, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                      <div className="px-2 mb-2">
                        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                          <motion.span
                            className="px-2 py-1 dark:bg-white/10 bg-black/10 backdrop-blur-sm rounded-xl text-xs sm:text-sm tracking-tight mt-2"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                          >
                            {project.category}
                          </motion.span>
                          <motion.span
                            className="px-2 py-1 dark:bg-white/10 bg-black/10 backdrop-blur-sm rounded-xl text-xs sm:text-sm tracking-tight mt-2"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                          >
                            {project.projectType}
                          </motion.span>
                        </div>
                        <motion.div
                          className="flex items-center justify-between dark:text-white text-black"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                        >
                          <h3 className="text-xl sm:text-2xl tracking-tighter mb-2 mt-2">
                            {project.name}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </motion.div>
                      </div>
                      <motion.div className="absolute -top-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 border-l-1 border-t-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 border-r-1 border-t-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 border-l-1 border-b-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 border-r-1 border-b-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Works;
