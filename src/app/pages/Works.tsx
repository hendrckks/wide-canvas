import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getProjects } from "../../lib/firebase/firestore";
import { Project } from "../../lib/types/project";
import { useNavigate } from "react-router-dom";

const Works = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blurAmount, setBlurAmount] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());

        // Prefetch and cache images
        projectsArray.forEach((project) => {
          const primaryImage =
            project.images.find((img) => img.isPrimary) || project.images[0];
          if (primaryImage?.url) {
            const img = new Image();
            img.src = primaryImage.url;
          }
        });

        setProjects(projectsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Use setTimeout to ensure scroll happens before navigation
    setTimeout(() => {
      navigate(`/project/${slug}`);
    }, 100);
  };

  return (
    <div className="relative h-full bg-black">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
        className="sticky top-0 h-screen flex flex-col items-center justify-between py-20 text-6xl sm:text-7xl md:text-8xl lg:text-7xl italic text-[#ff6017] tracking-tighter z-0 bg-black/5"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex-1 flex items-center justify-center">
            Selected Works
          </div>
          <p className="text-white/80 text-xs font-medium flex items-center absolute bottom-10 tracking-normal">
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
            KEEP SCROLLING ]
          </p>
        </div>
      </motion.div>
      <div
        ref={projectsRef}
        className="relative z-10 bg-black/90 backdrop-blur-sm py-20 px-4 sm:px-5 md:px-5 lg:px-5 -mt-screen"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {projects.map((project, index) => {
            const primaryImage =
              project.images.find((img) => img.isPrimary) || project.images[0];
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
                  <motion.img
                    src={primaryImage.url}
                    alt={project.name}
                    className="w-full h-[400px] object-cover rounded-sm p-2 mb-2"
                  />
                  <div className="px-2 mb-2">
                    <div className="flex gap-2 flex-wrap">
                      <motion.span
                        className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm tracking-tight mt-2"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                      >
                        {project.category}
                      </motion.span>
                      <motion.span
                        className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm tracking-tight mt-2"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                      >
                        {project.projectType}
                      </motion.span>
                    </div>
                    <motion.div
                      className="flex items-center justify-between text-white"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      <h3 className="text-2xl tracking-tighter mb-2 mt-2">
                        {project.name}
                      </h3>
                      <ArrowUpRight className="w-6 h-6" />
                    </motion.div>
                  </div>
                  <motion.div className="absolute -top-1 -left-1 w-4 h-4 border-l-1 border-t-1 border-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div className="absolute -top-1 -right-1 w-4 h-4 border-r-1 border-t-1 border-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-1 border-b-1 border-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-1 border-b-1 border-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
