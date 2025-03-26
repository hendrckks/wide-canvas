import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { getProjects } from "../lib/firebase/firestore";
import { Project } from "../lib/types/project";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";

const Gallery = () => {
  const { scrollY } = useScroll();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Single transform for all items
  const yTransform = useTransform(scrollY, [0, 3000], [0, -250], {
    clamp: true,
  });

  // Visibility state
  const [visibleItems, setVisibleItems] = useState<Set<number>>(
    new Set([0, 1, 2])
  );
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());
        // Sort projects by order field in ascending order (0 first)
        const sortedProjects = projectsArray.sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );
        setProjects(sortedProjects.slice(0, 5));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Optimized intersection observer
  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0"
          );
          setVisibleItems((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) {
              next.add(index);
            } else {
              next.delete(index);
            }
            return next;
          });
        });
      },
      {
        root: containerRef.current,
        rootMargin: "1000px 0px",
        threshold: 0.01,
      }
    );

    observerRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [isLoading, projects.length]);

  const handleNavigateToProject = useCallback(
    (slug: string) => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setTimeout(() => navigate(`/project/${slug}`), 50);
    },
    [navigate]
  );

  const positionClasses = [
    "sm:left-1/2 sm:-translate-x-1/2 sm:top-[10%]",
    "sm:left-[8%] sm:top-[32%]",
    "sm:right-[8%] sm:top-[38%]",
    "sm:left-[20%] sm:top-[59%]",
    "sm:left-1/2 sm:-translate-x-1/2 sm:top-[80%]",
  ];

  return (
    <div
      ref={containerRef}
      className="relative scroll-smooth min-h-[400vh] h-full transparent dark:text-white text-black -mt-28"
      style={{
        perspective: "1000px",
        contentVisibility: "auto",
      }}
    >
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={index}
              className={`sm:absolute ${positionClasses[index]} mb-16`}
            >
              <SkeletonLoader
                imageHeight={index === 2 ? "h-[450px]" : "h-[400px]"}
                className={index === 2 ? "w-[450px]" : "w-[500px]"}
              />
            </motion.div>
          ))
        : projects.map((project, index) => {
            const primaryImage =
              project.images.find((img) => img.isPrimary) || project.images[0];

            return (
              <motion.div
                key={project.slug}
                ref={(el) => {
                  if (el) {
                    el.setAttribute("data-index", index.toString());
                    observerRefs.current[index] = el;
                  }
                }}
                className={`sm:absolute ${positionClasses[index]} mb-16`}
                style={{
                  y: yTransform,
                  visibility: visibleItems.has(index) ? "visible" : "hidden",
                  transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className="group relative cursor-pointer transform-gpu"
                  onClick={() => handleNavigateToProject(project.slug)}
                >
                  <motion.img
                    src={primaryImage?.url}
                    alt={project.name}
                    className="w-[300px] sm:w-[350px] lg:w-[400px] h-[400px] sm:h-[400px] lg:h-[350px] object-cover rounded-sm p-2 mb-2"
                    loading={index < 2 ? "eager" : "lazy"}
                    style={{
                      width: index === 2 ? "450px" : "500px",
                      height: index === 1 || index === 3 ? "450px" : "500px",
                      transform: "translate3d(0,0,0)",
                      objectPosition: "center 30%",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <div className="px-2 mb-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 dark:bg-white/10 bg-black/10 rounded-xl text-sm">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 dark:bg-white/10 bg-black/10 rounded-xl text-sm">
                        {project.projectType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <h3 className="text-3xl tracking-tighter">
                        {project.name}
                      </h3>
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
    </div>
  );
};

export default Gallery;
