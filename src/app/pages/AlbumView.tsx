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
  const imageY = useTransform(scrollY, [0, 1000], [0, 10]);
  const contentY = useTransform(scrollY, [0, 1000], [0, -400]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtherProjects = async () => {
      try {
        const projectsMap = await getProjects();
        const projectsArray = Array.from(projectsMap.values());
        const filteredProjects = projectsArray.filter((p) => p.slug !== slug);

        // Prefetch and cache images
        filteredProjects.forEach((project) => {
          const primaryImage =
            project.images.find((img) => img.isPrimary) || project.images[0];
          if (primaryImage?.url) {
            const img = new Image();
            img.src = primaryImage.url;
          }
        });

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
        scrollContainer.scrollLeft += 1;

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoScrolling]);

  // Always scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          // This isn't needed anymore since we're already scrolling at the component mount
          // but keeping it for backwards compatibility
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

  const handleNavigateToProject = (slug: string) => {
    // Force scroll to top before navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Use setTimeout to ensure scroll happens before navigation
    setTimeout(() => {
      navigate(`/project/${slug}`);
    }, 250);
  };

  return (
    <div className="relative min-h-[200vh] font-clash bg-black text-white overflow-hidden">
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
          <h1 className="text-white font-clash text-[140px] -tracking-[8px] bg-transparent font-light">
            {project.name}
          </h1>
        </div>
        <div className="bg-black flex-col h-screen backdrop-blur-sm flex items-center w-screen">
          <div className="mt-28 max-w-3xl w-full px-6">
            <p className="text-4xl text-white font-clash tracking-tight text-center leading-12 font-light mb-20">
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
      <div className="w-full bg-black py-20">
        <div className="max-w-[1800px] mx-auto px-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl italic text-[#ff6017] tracking-tighter mb-10 text-center">
            Other Selected Works
          </h2>
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-hidden"
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {otherProjects.map((project, index) => {
              const primaryImage =
                project.images.find((img) => img.isPrimary) ||
                project.images[0];
              return (
                <motion.div
                  key={project.slug}
                  className="flex-shrink-0 mt-10"
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
                      className="w-[400px] h-[350px] object-cover rounded-sm p-2 mb-2"
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
                        <h3 className="text-xl tracking-tighter mb-2 mt-2">
                          {project.name}
                        </h3>
                        <ArrowUpRight className="w-5 h-5" />
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
    </div>
  );
};

export default AlbumView;
