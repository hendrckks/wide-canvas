import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjects } from "../lib/firebase/firestore";
import { Project } from "../lib/types/project";

const Gallery = () => {
  const { scrollY } = useScroll();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());
        const projects = projectsArray.slice(0, 5);
        
        // Prefetch and cache images
        projects.forEach(project => {
          const primaryImage = project.images.find(img => img.isPrimary) || project.images[0];
          if (primaryImage?.url) {
            const img = new Image();
            img.src = primaryImage.url;
          }
        });

        setProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Pre-calculate transform values for each image
  const transform1 = useTransform(scrollY, [0, 1000], [0, -50], { clamp: false });
  const transform2 = useTransform(scrollY, [500, 1500], [0, -50], { clamp: false });
  const transform3 = useTransform(scrollY, [1000, 2000], [0, -50], { clamp: false });
  const transform4 = useTransform(scrollY, [1500, 2500], [0, -50], { clamp: false });
  const transform5 = useTransform(scrollY, [2000, 3000], [0, -50], { clamp: false });

  const transforms = [transform1, transform2, transform3, transform4, transform5];

  return (
    <div className="relative min-h-[380vh] h-full transparent">
      {projects.map((project, index) => {
        const primaryImage = project.images.find((img) => img.isPrimary) || project.images[0];
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
            style={{ y: transforms[index] }}
            className={`sm:absolute ${
              index === 0
                ? "sm:left-1/2 sm:-translate-x-1/2 sm:top-[10%]"
                : index === 1
                ? "sm:left-[10%] sm:top-[35%]"
                : index === 2
                ? "sm:right-[8%] sm:top-[38%]"
                : index === 3
                ? "sm:left-[20%] sm:top-[59%]"
                : "sm:left-1/2 sm:-translate-x-1/2 sm:top-[85%]"
            } mb-16`}
          >
            <motion.div
              className="group relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
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
                  <h3 className="text-3xl tracking-tighter mb-2 mt-2">
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
  );
};

export default Gallery;
