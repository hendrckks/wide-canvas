import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Project } from "../lib/types/project";
import { MotionValue } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
  transform?: MotionValue<number>;
  imageWidth?: string;
  imageHeight?: string;
  className?: string;
  scaleOnHover?: number;
}

const ProjectCard = ({
  project,
  index,
  transform,
  imageWidth = "full",
  imageHeight = "400px",
  className = "",
  scaleOnHover = 1.02,
}: ProjectCardProps) => {
  const primaryImage =
    project.images.find((img) => img.isPrimary) || project.images[0];

  return (
    <motion.div
      key={project.slug}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      style={transform ? { y: transform } : undefined}
      className={className}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: scaleOnHover }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          src={primaryImage.url}
          alt={project.name}
          className={`w-${imageWidth} h-[${imageHeight}] object-cover rounded-sm p-2 mb-2`.replace(/\[|\]/g, '')}
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
};

export default ProjectCard;