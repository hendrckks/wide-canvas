import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Circle,
  Clock,
  Computer,
  Grid,
  MapPin,
  Triangle,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjects } from "../../lib/firebase/firestore";
import { Project } from "../../lib/types/project";
import LoadingScreen from "../../components/LoadingScreen";

const AlbumView = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 1000], [0, 10]);
  const contentY = useTransform(scrollY, [0, 1000], [0, -400]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    const fetchProject = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const projects = await getProjects();
        const foundProject = Array.from(projects.values()).find(
          (p) => p.slug === slug
        );
        if (foundProject) {
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
      <div className="text-white text-center py-20">Project not found</div>
    );
  }

  return (
    <div className="relative min-h-[200vh] font-display bg-black text-white overflow-hidden">
      <div className="sticky pt-20 pb-5 px-14 top-0 z-10 w-full h-full flex items-center justify-center">
        <motion.div
          className="w-full h-[65vh] overflow-hidden"
          style={{ y: imageY }}
        >
          {project.images[0] && (
            <motion.img
              src={project.images[0].url}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            />
          )}
        </motion.div>
      </div>
      <motion.div
        style={{ y: contentY }}
        className="sticky flex flex-col mb-8 items-center -mt-28 top-0 z-40 w-full min-h-screen transform transition-transform duration-300 ease-out"
      >
        <div className="h-full mb-3">
          <h1 className="text-white font-display text-[140px] -tracking-[8px] bg-transparent font-light">
            {project.name}
          </h1>
        </div>
        <div className="bg-black flex-col h-screen backdrop-blur-sm flex items-center w-screen">
          <div className="mt-28 max-w-3xl w-full px-6">
            <p className="text-4xl text-white font-display tracking-tight text-center leading-12 font-light mb-20">
              {project.description}
            </p>
          </div>
          <div className="max-w-[600px] w-full bg-white/5 backdrop-blur-xl p-8 font-light rounded-lg border border-white/10 shadow-lg shadow-black/5">
            <div className="space-y-7 py-[10px] relative rounded-lg">
              <div className="flex justify-between items-center hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 text-xl">
                  <Grid className="w-5 h-5" />
                  <span>Category</span>
                </div>
                <span>{project.category}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300 z-50">
                <div className="flex items-center gap-3 text-xl">
                  <Triangle className="w-5 h-5 " />
                  <span>Project Type</span>
                </div>
                <span>{project.projectType}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 text-xl">
                  <Camera className="w-5 h-5" />
                  <span>Camera</span>
                </div>
                <span>{project.camera?.join(", ")}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 text-xl">
                  <Circle className="w-5 h-5" />
                  <span>Lenses</span>
                </div>
                <div className="text-right">
                  <span>{project.lenses?.join(", ")}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 text-xl">
                  <Computer className="w-5 h-5" />
                  <span>Other Devices</span>
                </div>
                <span>{project?.otherDevices?.join(", ") || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 text-xl">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </div>
                <span>{project.location}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 text-xl">
                  <Clock className="w-5 h-5" />
                  <span>Time</span>
                </div>
                <span>
                  {project.time
                    ? new Date(project.time).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : ""}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 text-xl">
                  <User className="w-5 h-5" />
                  <span>Client</span>
                </div>
                <span>{project?.client || "N/A"}</span>
              </div>
              <div
                className="p-4 text-center items-center justify-center gap-6 border border-white/20 flex relative overflow-hidden group transition-all duration-200 hover:border-transparent cursor-pointer backdrop-blur-md bg-white/5 rounded-md hover:bg-[#ff6017]/10"
                style={{ isolation: "isolate" }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-2">
                  Buy Prints <ArrowRight size={18} />
                </span>
                <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="w-full min-h-screen bg-black px-14 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1800px] mx-auto">
          {project?.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden group ${
                index === 0
                  ? "md:col-span-2 md:row-span-2"
                  : index === 3
                  ? "lg:col-span-2"
                  : ""
              }`}
            >
              <motion.img
                src={image.url}
                alt={`Album image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                style={{
                  height:
                    index === 0 ? "800px" : index === 3 ? "400px" : "400px",
                }}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumView;
