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
import { Project, ProjectImage } from "../../lib/types/project";
import LoadingScreen from "../../components/LoadingScreen";

// Extend the ProjectImage type to include image dimensions
interface ExtendedProjectImage extends ProjectImage {
  width?: number;
  height?: number;
}

// Create an extended Project type with the updated images type
interface ExtendedProject extends Omit<Project, "images"> {
  images: ExtendedProjectImage[];
}

const AlbumView = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);
  const { scrollY } = useScroll();

  // Create transform values directly at the component level, not inside callbacks
  const imageY = useTransform(scrollY, [0, 500], [0, 5]);
  const contentY = useTransform(scrollY, [0, 1000], [0, -500]);

  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  // We'll remove the unused variable warning by adding a use case for it
  const loadedImages = useRef<Set<string>>(new Set());
  const totalImagesToLoad = useRef<number>(0);

  // Track loading progress for the loading screen
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate page height only once after all images load
  const getCachedHeight = (slug: string) => {
    const cached = localStorage.getItem(`pageHeight-${slug}`);
    if (!cached) return null;
    const { height, timestamp } = JSON.parse(cached);
    // Cache valid for 24 hours (86400000 ms)
    if (Date.now() - timestamp < 86400000) return height;
    return null;
  };

  const setCachedHeight = (slug: string, height: number) => {
    localStorage.setItem(
      `pageHeight-${slug}`,
      JSON.stringify({ height, timestamp: Date.now() })
    );
  };

  useEffect(() => {
    const cachedHeight = slug ? getCachedHeight(slug) : null;

    if (cachedHeight) {
      setPageHeight(cachedHeight);
      document.body.style.height = `${cachedHeight}px`;
    }

    if (allImagesLoaded && pageRef.current && !cachedHeight) {
      const height = pageRef.current.scrollHeight;
      setPageHeight(height);
      document.body.style.height = `${height}px`;
      if (slug) setCachedHeight(slug, height);
    }
  }, [allImagesLoaded, slug]);

  useEffect(() => {
    const fetchOtherProjects = async () => {
      try {
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());
        const filteredProjects = projectsArray.filter((p) => p.slug !== slug);
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
        scrollContainer.scrollLeft += 0.5;

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          let resetPosition = scrollContainer.scrollLeft;
          const resetScroll = () => {
            if (resetPosition > 0) {
              resetPosition -= 10;
              scrollContainer.scrollLeft = Math.max(0, resetPosition);
              requestAnimationFrame(resetScroll);
            } else {
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

  const smoothScrollToTop = () => {
    const startPosition = window.scrollY;
    const startTime = performance.now();
    const duration = 500;

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startPosition * (1 - easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    smoothScrollToTop();

    // Set will-change only on elements that need it, and remove it after scrolling
    const addWillChangeHint = () => {
      if (pageRef.current) {
        const elements = pageRef.current.querySelectorAll(".motion-element");
        elements.forEach((el) => {
          (el as HTMLElement).style.willChange = "transform";
        });
      }
    };

    addWillChangeHint();

    // Set up passive scroll listeners
    const scrollOptions = { passive: true };

    // Remove will-change after scrolling stops to free up resources
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (pageRef.current) {
          const elements = pageRef.current.querySelectorAll(".motion-element");
          elements.forEach((el) => {
            (el as HTMLElement).style.willChange = "auto";
          });
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, scrollOptions);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
      // Don't reset body height immediately - let the new page set it
      setTimeout(() => {
        if (!document.body.getAttribute("data-keep-height")) {
          document.body.style.height = "";
        }
      }, 100);
    };
  }, [slug]);

  // Preload all images before showing content
  useEffect(() => {
    const preloadImage = async (url: string) => {
      return new Promise<{ url: string; width: number; height: number }>(
        (resolve) => {
          const img = new Image();
          img.onload = () =>
            resolve({
              url,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          img.onerror = () => resolve({ url, width: 0, height: 0 });
          img.src = url;
        }
      );
    };

    // Start simulating loading progress immediately
    const startProgressSimulation = () => {
      // Clear any existing interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Reset progress
      setLoadingProgress(0);
      
      // Simulate progress up to 90% (the last 10% will be set when images are actually loaded)
      let simulatedProgress = 0;
      progressIntervalRef.current = setInterval(() => {
        simulatedProgress += Math.random() * 3; // Random increment for more realistic effect
        if (simulatedProgress > 90) {
          clearInterval(progressIntervalRef.current!);
          simulatedProgress = 90;
        }
        setLoadingProgress(Math.min(simulatedProgress, 90));
      }, 150);
    };

    const fetchProject = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        startProgressSimulation(); // Start progress simulation
        
        const projects = await getProjects();
        const foundProject = Array.from(projects.values()).find(
          (p) => p.slug === slug
        );

        if (foundProject) {
          // Initialize with the original project data
          setProject(foundProject as ExtendedProject);

          // Count total images to load (project + other projects)
          const imageUrls = foundProject.images
            .filter((img) => img.url)
            .map((img) => img.url as string);

          totalImagesToLoad.current = imageUrls.length;

          // Preload all project images in parallel
          const imageData = await Promise.all(imageUrls.map(preloadImage));

          // Add dimensions to the existing image objects
          const imagesWithDimensions = foundProject.images.map(
            (originalImg) => {
              const dimensions = imageData.find(
                (img) => img.url === originalImg.url
              );
              return {
                ...originalImg,
                width: dimensions?.width || 0,
                height: dimensions?.height || 0,
              };
            }
          );

          // Track loaded images
          imageData.forEach((img) => {
            loadedImages.current.add(img.url);
          });

          // Update project with enhanced images
          setProject((prev) =>
            prev ? { ...prev, images: imagesWithDimensions } : null
          );

          setAllImagesLoaded(true);
          
          // Clear any existing interval and set progress to 100%
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          setLoadingProgress(100);

          // Short delay before removing loading screen
          setTimeout(() => {
            setIsLoading(false);
          }, 600);
        } else {
          // Clear any existing interval if project not found
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        // Clear any existing interval on error
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        setIsLoading(false);
      }
    };

    fetchProject();

    return () => {
      // Clean up interval and reset page height when component unmounts
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      document.body.style.height = "";
    };
  }, [slug]);

  // Add this useEffect to calculate page height using image dimensions
  useEffect(() => {
    if (!project || !pageRef.current) return;

    // Calculate image grid height
    let gridHeight = 0;
    const columnWidth = pageRef.current.offsetWidth / 3; // Approximate column width
    project.images.forEach((img, index) => {
      const gridClass = getGridClass(index, project.images.length);
      const cols = gridClass.includes("col-span-2") ? 2 : 1;
      const rows = gridClass.includes("row-span-2") ? 2 : 1;

      // Use width and height if available, fallback to aspect ratio 1 if not
      const width = img.width || 1;
      const height = img.height || 1;
      const aspectRatio = width / height;
      const calculatedHeight = ((columnWidth * cols) / aspectRatio) * rows;
      gridHeight += calculatedHeight;
    });

    // Add other section heights (header, info, etc.)
    const totalHeight = gridHeight + 800; // Adjust based on your layout
    setPageHeight(totalHeight);
    document.body.style.height = `${totalHeight}px`;
  }, [project]);

  // Create an optimized grid layout based on image count
  const getGridClass = (index: number, totalImages: number) => {
    if (totalImages <= 3) {
      return "col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1";
    }

    if (index === 0 || index % 5 === 0) {
      return "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2";
    }

    if (index % 3 === 0) {
      return "col-span-1 lg:col-span-2";
    }

    return "col-span-1";
  };

  if (isLoading) {
    return (
      <LoadingScreen
        onLoadingComplete={() => {
          window.scrollTo({
            top: 0,
            behavior: "instant",
          });
        }}
        loadingProgress={loadingProgress}
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

  const handleNavigateToProject = (newSlug: string) => {
    document.body.setAttribute("data-keep-height", "true");
    smoothScrollToTop();
    setTimeout(() => {
      document.body.removeAttribute("data-keep-height");
      navigate(`/project/${newSlug}`);
    }, 250);
  };

  return (
    <div
      ref={pageRef}
      className="relative h-full font-clash dark:bg-black bg-white dark:text-white text-black overflow-hidden"
      style={{ height: pageHeight > 0 ? pageHeight : "auto" }}
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
                <span className="relative z-10 group-hover:text-black text-white dark:text-black transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base">
                  Buy Prints <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in" />
              </div>
            </div>
          </div>
        </div>
        {/* Images gallery section - improved to fill space properly */}
        <div className="w-full dark:bg-black bg-white px-4 sm:px-8 md:px-14 py-2 -mb-72">
          <div className="relative z-40 pt-40">
            {/* Modified grid layout to avoid gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full mx-auto">
              {project?.images.length > 0 &&
                project.images.map((image, index) => {
                  const imageClass = getGridClass(index, project.images.length);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "100px" }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={`relative overflow-hidden group ${imageClass}`}
                    >
                      <motion.img
                        src={image.url}
                        alt={`Album image ${index + 1}`}
                        className="w-full object-contain transition-transform duration-500 ease-out"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      {/* Optional overlay on hover for a more refined look */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300"></div>
                    </motion.div>
                  );
                })}

              {/* If there are too few images, add placeholder elements to maintain grid structure */}
              {project?.images.length > 0 && project.images.length < 3 && (
                <div className="col-span-1 sm:col-span-1 lg:col-span-1"></div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      {/* Other projects section */}
      <div className="w-full hidden -mt-80 dark:bg-black bg-white mb-10 sm:mb-16 md:mb-20">
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
                  >
                    <motion.img
                      src={primaryImage.url}
                      alt={project.name}
                      className="w-full sm:w-72 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 object-cover rounded-sm p-2 mb-2"
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
