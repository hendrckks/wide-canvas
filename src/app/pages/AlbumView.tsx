import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Circle,
  Clock,
  Computer,
  Grid,
  MapPin,
  Triangle,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjects } from "../../lib/firebase/firestore";
import { Project } from "../../lib/types/project";
import LoadingScreen from "../../components/LoadingScreen";

const AlbumView = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();

  // Reduce the transformation range for smoother parallax
  const imageY = useTransform(scrollY, [0, 500], [0, 5]); // Reduced from 10 to 5
  const contentY = useTransform(scrollY, [0, 1000], [0, -500]); // Reduced from -400 to -200

  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOtherProjects = async () => {
      try {
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());
        const filteredProjects = projectsArray.filter((p) => p.slug !== slug);

        // Enhanced caching for other projects' images
        await Promise.all(
          filteredProjects.slice(0, 5).map(async (project) => {
            const primaryImage = project.images.find((img) => img.isPrimary) || project.images[0];
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
                console.error('Error caching other project image:', error);
                // Fallback to basic preloading
                const img = new Image();
                img.src = primaryImage.url;
              }
            }
          })
        );

        setOtherProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching other projects:", error);
      }
    };

    fetchOtherProjects();
  }, [slug]);

  useEffect(() => {
    let animationFrameId: number;
    const scrollContainer = scrollContainerRef.current;

    const autoScroll = () => {
      if (scrollContainer && isAutoScrolling) {
        // Slower scroll speed
        scrollContainer.scrollLeft += 0.5;

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          // Reset more smoothly by gradually moving back
          let resetPosition = scrollContainer.scrollLeft;
          const resetScroll = () => {
            if (resetPosition > 0) {
              resetPosition -= 10;
              scrollContainer.scrollLeft = Math.max(0, resetPosition);
              requestAnimationFrame(resetScroll);
            } else {
              // Resume normal scrolling once reset is complete
              scrollContainer.scrollLeft = 0;
              animationFrameId = requestAnimationFrame(autoScroll);
            }
          };
          resetScroll();
          return;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoScrolling]);

  // Implement smooth scrolling using requestAnimationFrame instead of behavior: "smooth"
  const smoothScrollToTop = () => {
    const startPosition = window.scrollY;
    const startTime = performance.now();
    const duration = 500; // ms

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

      window.scrollTo(0, startPosition * (1 - easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Always scroll to top when component mounts or slug changes
  useEffect(() => {
    smoothScrollToTop();

    // Add a will-change hint to elements that will animate
    const addWillChangeHint = () => {
      if (pageRef.current) {
        const elements = pageRef.current.querySelectorAll(".motion-element");
        elements.forEach((el) => {
          (el as HTMLElement).style.willChange = "transform";
        });
      }
    };

    addWillChangeHint();

    // Set up passive scroll listeners for better performance
    const scrollOptions = { passive: true };
    window.addEventListener("scroll", () => {}, scrollOptions);

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, [slug]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const projects = await getProjects();
        const foundProject = Array.from(projects.values()).find(
          (p) => p.slug === slug
        );
        if (foundProject) {
          // Enhanced image caching strategy
          await Promise.all(
            foundProject.images.map(async (image) => {
              if (image.url) {
                try {
                  // Check if the image is already in the cache
                  const cache = await caches.open('project-images');
                  const cachedResponse = await cache.match(image.url);
                  
                  if (!cachedResponse) {
                    // If not in cache, fetch and cache the image
                    const response = await fetch(image.url, {
                      method: 'GET',
                      cache: 'force-cache',
                      headers: {
                        'Cache-Control': 'max-age=31536000', // Cache for 1 year
                      },
                    });
                    
                    if (response.ok) {
                      await cache.put(image.url, response.clone());
                      // Also preload the image
                      const img = new Image();
                      img.src = image.url;
                    }
                  }
                } catch (error) {
                  console.error('Error caching image:', error);
                  // Fallback to basic preloading if caching fails
                  const img = new Image();
                  img.src = image.url;
                }
              }
            })
          );
          setProject(foundProject);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <LoadingScreen
        onLoadingComplete={() => {
          window.scrollTo({
            top: 0,
            behavior: "instant",
          });
        }}
      />
    );
  }

  if (!project) {
    return (
      <div className="dark:text-white text-black text-center py-20">
        Project not found
      </div>
    );
  }

  const handleNavigateToProject = (slug: string) => {
    // Force scroll to top before navigation using custom smooth scroll
    smoothScrollToTop();
    // Use setTimeout to ensure scroll happens before navigation
    setTimeout(() => {
      navigate(`/project/${slug}`);
    }, 250);
  };

  // Create an optimized grid layout based on image count
  const getGridClass = (index: number, totalImages: number) => {
    // If we have 1-3 images, make them all larger
    if (totalImages <= 3) {
      return "col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1";
    }

    // For first image and every 5th image after that
    if (index === 0 || index % 5 === 0) {
      return "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2";
    }

    // For every third image
    if (index % 3 === 0) {
      return "col-span-1 lg:col-span-2";
    }

    // Default size
    return "col-span-1";
  };

  return (
    <div
      ref={pageRef}
      className="relative h-full font-clash dark:bg-black bg-white dark:text-white text-black overflow-hidden"
    >
      {/* Hero section with sticky header and parallax effect */}
      <div className="sticky pt-20 pb-5 px-4 sm:px-8 md:px-14 top-0 z-10 w-full h-full">
        <motion.div
          className="w-full h-[40vh] sm:h-[50vh] md:h-[65vh] overflow-hidden motion-element"
          style={{ y: imageY }}
        >
          {project.images[0] && (
            <motion.img
              src={project.images[0].url}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              loading="eager"
            />
          )}
        </motion.div>
      </div>

      {/* Project info section */}
      <motion.div
        style={{ y: contentY }}
        className="relative flex flex-col items-center -mt-20 z-40 w-full transform transition-transform duration-300 ease-out motion-element"
      >
        <div className="h-full mb-3 px-2 sm:px-0">
          <h1 className="dark:text-white text-black font-clash text-6xl sm:text-6xl md:text-8xl lg:text-[140px] -tracking-[2px] sm:-tracking-[4px] md:-tracking-[6px] lg:-tracking-[8px] bg-transparent font-light text-center">
            {project.name}
          </h1>
        </div>
        <div className="dark:bg-black bg-white flex-col h-auto backdrop-blur-sm flex items-center w-screen">
          <div className="mt-10 sm:mt-20 md:mt-28 max-w-3xl w-full px-4 sm:px-6 mb-20">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl dark:text-white text-black font-clash tracking-tight text-center leading-tight sm:leading-normal md:leading-12 font-light">
              {project.description}
            </p>
          </div>
          <div className="max-w-[600px] w-full mx-4 dark:bg-white/5 bg-black/5 backdrop-blur-xl p-4 sm:p-6 md:p-8 font-light rounded-lg border dark:border-white/10 border-black/10 shadow-lg shadow-black/5">
            <div className="space-y-4 sm:space-y-6 md:space-y-7 py-[10px] relative rounded-lg">
              <div className="flex justify-between items-center hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Category</span>
                </div>
                <span className="text-sm sm:text-base">{project.category}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300 z-50">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <Triangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Project Type</span>
                </div>
                <span className="text-sm sm:text-base">
                  {project.projectType}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Camera</span>
                </div>
                <span className="text-sm sm:text-base">
                  {project.camera?.join(", ")}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <Circle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Lenses</span>
                </div>
                <div className="text-right text-sm sm:text-base">
                  <span>{project.lenses?.join(", ")}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <Computer className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Other Devices</span>
                </div>
                <span className="text-sm sm:text-base">
                  {project?.otherDevices?.join(", ") || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Location</span>
                </div>
                <span className="text-sm sm:text-base">{project.location}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Time</span>
                </div>
                <span className="text-sm sm:text-base">
                  {project.time
                    ? new Date(project.time).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : ""}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Client</span>
                </div>
                <span className="text-sm sm:text-base">
                  {project?.client || "N/A"}
                </span>
              </div>
              <div
                className="p-3 sm:p-4 text-center items-center justify-center gap-3 sm:gap-6 border dark:border-white/20 border-black/20 flex relative overflow-hidden group transition-all duration-200 hover:border-transparent cursor-pointer backdrop-blur-md dark:bg-white/5 bg-black/5 rounded-md hover:bg-[#ff6017]/10"
                style={{ isolation: "isolate" }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base">
                  Buy Prints <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in" />
              </div>
            </div>
          </div>
        </div>
         {/* Images gallery section - improved to fill space properly */}
      <div className="w-full dark:bg-black bg-white px-4 sm:px-8 md:px-14 py-2 mb-18">
        <div className="relative z-40 pt-40">
          {/* Modified grid layout to avoid gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full mx-auto">
            {project?.images.length > 0 &&
              project.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`relative overflow-hidden group ${getGridClass(
                    index,
                    project.images.length
                  )}`}
                >
                  <motion.img
                    src={image.url}
                    alt={`Album image ${index + 1}`}
                    className="w-full object-contain transition-transform duration-500 ease-out"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  {/* Optional overlay on hover for a more refined look */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300"></div>
                </motion.div>
              ))}

            {/* If there are too few images, add placeholder elements to maintain grid structure */}
            {project?.images.length > 0 && project.images.length < 3 && (
              <div className="col-span-1 sm:col-span-1 lg:col-span-1"></div>
            )}
          </div>
        </div>
      </div>
      </motion.div>
      {/* Other projects section */}
      <div className="w-full dark:bg-black bg-white mb-10 sm:mb-16 md:mb-20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 md:px-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-[#ff6017] tracking-tighter mb-6 sm:mb-8 md:mb-10 text-center">
            Other Selected Works
          </h2>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide"
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
            style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
          >
            {otherProjects.map((project, index) => {
              const primaryImage =
                project.images.find((img) => img.isPrimary) ||
                project.images[0];
              return (
                <motion.div
                  key={project.slug}
                  className="flex-shrink-0 mt-6 sm:mt-8 md:mt-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <motion.div
                    className="group relative cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleNavigateToProject(project.slug)}
                    onMouseEnter={async () => {
                      try {
                        if (index < 2) {
                          const projectsMap = await getProjects();
                          const hoveredProject = Array.from(
                            projectsMap.values()
                          ).find((p) => p.slug === project.slug);
                          if (
                            hoveredProject &&
                            hoveredProject.images.length > 0
                          ) {
                            const img = new Image();
                            img.src = hoveredProject.images[0].url;
                          }
                        }
                      } catch (error) {
                        console.error("Error prefetching project:", error);
                      }
                    }}
                  >
                    <motion.img
                      src={primaryImage.url}
                      alt={project.name}
                      className="w-full sm:w-72 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 object-cover rounded-sm p-2 mb-2"
                      loading="lazy"
                    />
                    <div className="px-2 mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <motion.span
                          className="px-2 py-1 dark:bg-white/10 bg-black/10 backdrop-blur-sm rounded-xl text-black/90 dark:text-white text-xs sm:text-sm tracking-tight mt-2"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                        >
                          {project.category}
                        </motion.span>
                        <motion.span
                          className="px-2 py-1 dark:bg-white/10 bg-black/10 backdrop-blur-sm rounded-xl text-black/90 dark:text-white text-xs sm:text-sm tracking-tight mt-2"
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
                        <h3 className="text-base sm:text-lg md:text-xl tracking-tighter mb-2 mt-2">
                          {project.name}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
        </div>
      </div>
    </div>
  );
};

export default AlbumView;
