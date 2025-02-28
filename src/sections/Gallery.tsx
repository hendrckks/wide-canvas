import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjects } from "../lib/firebase/firestore";
import { Project } from "../lib/types/project";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";

const Gallery = () => {
  const { scrollY } = useScroll();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());
        const projects = projectsArray.slice(0, 5);

        // Enhanced image loading with caching
        await Promise.all(
          projects.map(async (project) => {
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
                    const img = new Image();
                    img.src = primaryImage.url;
                  }
                }
              } catch (error) {
                console.error('Error caching image:', error);
                // Fallback to basic preloading
                const img = new Image();
                img.src = primaryImage.url;
              }
            }
          })
        );

        setProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Pre-calculate transform values for each image
  const transform1 = useTransform(scrollY, [0, 1000], [0, -50], {
    clamp: false,
  });
  const transform2 = useTransform(scrollY, [500, 1500], [0, -50], {
    clamp: false,
  });
  const transform3 = useTransform(scrollY, [1000, 2000], [0, -50], {
    clamp: false,
  });
  const transform4 = useTransform(scrollY, [1500, 2500], [0, -50], {
    clamp: false,
  });
  const transform5 = useTransform(scrollY, [2000, 3000], [0, -50], {
    clamp: false,
  });

  const transforms = [
    transform1,
    transform2,
    transform3,
    transform4,
    transform5,
  ];

  // Handle navigation with scroll reset
  const handleNavigateToProject = (slug: string) => {
    // Force scroll to top before navigation
    window.scrollTo({ top: 0, behavior: "instant" });
    // Use setTimeout to ensure scroll happens before navigation
    setTimeout(() => {
      navigate(`/project/${slug}`);
    }, 150);
  };

  return (
    <div className="relative min-h-[400vh] h-full transparent dark:text-white text-black">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              className={`sm:absolute ${
                index === 0
                  ? "sm:left-1/2 sm:-translate-x-1/2 sm:top-[10%]"
                  : index === 1
                  ? "sm:left-[8%] sm:top-[32%]"
                  : index === 2
                  ? "sm:right-[8%] sm:top-[38%]"
                  : index === 3
                  ? "sm:left-[20%] sm:top-[59%]"
                  : "sm:left-1/2 sm:-translate-x-1/2 sm:top-[80%]"
              } mb-16`}
            >
              <SkeletonLoader
                imageHeight={
                  index === 0 ? "h-[450px] w-[500px]" : index === 1 ? "h-[400px] w-[500px]" : index === 2 ? "h-[450px] w-[450px]" : index === 3 ? "h-[400px] w-[500px]" : "h-[450px] w-[500px]"
                }
              />
            </motion.div>
          ))
        : projects.map((project, index) => {
            const primaryImage =
              project.images.find((img) => img.isPrimary) || project.images[0];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                style={{ y: transforms[index] }}
                className={`sm:absolute ${
                  index === 0
                    ? "sm:left-1/2 sm:-translate-x-1/2 sm:top-[10%]"
                    : index === 1
                    ? "sm:left-[8%] sm:top-[32%]"
                    : index === 2
                    ? "sm:right-[8%] sm:top-[38%]"
                    : index === 3
                    ? "sm:left-[20%] sm:top-[59%]"
                    : "sm:left-1/2 sm:-translate-x-1/2 sm:top-[80%]"
                } mb-16`}
              >
                <motion.div
                  className="group relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
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
                  <motion.img
                    src={primaryImage.url}
                    alt={project.name}
                    className="w-[300px] sm:w-[350px] lg:w-[400px] h-[250px] sm:h-[300px] lg:h-[350px] object-cover rounded-sm p-2 mb-2"
                    style={{
                      width:
                        index === 0 ? "500px" : index === 2 ? "450px" : "500px",
                      height:
                        index === 1 ? "400px" : index === 3 ? "400px" : "450px",
                    }}
                    loading={index < 3 ? "eager" : "lazy"}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="px-2 mb-2">
                    <div className="flex gap-2 flex-wrap">
                      <motion.span
                        className="px-2 py-1 dark:bg-white/10 bg-black/10 backdrop-blur-sm rounded-xl text-sm tracking-tight mt-2"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                      >
                        {project.category}
                      </motion.span>
                      <motion.span
                        className="px-2 py-1 dark:bg-white/10 bg-black/10 backdrop-blur-lg rounded-xl text-sm tracking-tight mt-2"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                      >
                        {project.projectType}
                      </motion.span>
                    </div>
                    <motion.div
                      className="flex items-center justify-between "
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      <h3 className="text-3xl tracking-tighter mb-2 mt-2">
                        {project.name}
                      </h3>
                      <ArrowUpRight className="w-6 h-6" />
                    </motion.div>
                  </div>
                  <motion.div className="absolute -top-1 -left-1 w-4 h-4 border-l-1 border-t-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div className="absolute -top-1 -right-1 w-4 h-4 border-r-1 border-t-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-1 border-b-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-1 border-b-1 dark:border-white/90 border-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </motion.div>
            );
          })}
    </div>
  );
};

export default Gallery;
