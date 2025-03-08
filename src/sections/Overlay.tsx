import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getOverlayVideos, VideoData } from "../lib/firebase/videoServices";

const Overlay = () => {
  const [overlayVideos, setOverlayVideos] = useState<
    Record<number, VideoData | null>
  >({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverlayVideos = async () => {
      try {
        setLoading(true);
        const videos = await getOverlayVideos();

        // Initialize with default empty values
        const videoMap: Record<number, VideoData | null> = {
          1: null,
          2: null,
          3: null,
          4: null,
        };

        // Fill in the videos we have
        videos.forEach((video) => {
          if (
            video.overlayPosition &&
            video.overlayPosition >= 1 &&
            video.overlayPosition <= 4
          ) {
            videoMap[video.overlayPosition] = video;
          }
        });

        setOverlayVideos(videoMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching overlay videos:", err);
        setError("Failed to load overlay videos");
      } finally {
        setLoading(false);
      }
    };

    fetchOverlayVideos();
  }, []);

  // Define course data array
  const courseData = [
    {
      title: "MASTER THE BASICS™",
      titleImage: "/hqm.png",
      description:
        "Professional shooting and meticulous editing for stunning, high-resolution results.",
      duration: "42 VIDEOS (12 HOURS)",
    },
    {
      title: "ADVANCED TECHNIQUES™",
      titleImage: "/creative.png",
      description:
        "Expert guidance on styling, poses, and mood to bring your vision to life.",
      duration: "56 VIDEOS (15 HOURS)",
    },
    {
      title: "POST-PRODUCTION PRO™",
      titleImage: "/PC.png",
      description:
        "In-depth discussion to align vision and create your perfect aesthetic.",
      duration: "64 VIDEOS (18 HOURS)",
    },
    {
      title: "BUSINESS OF FILM™",
      titleImage: "/behind.png",
      description:
        "Optional footage capturing the creative process and artistry of every shoot.",
      duration: "48 VIDEOS (14 HOURS)",
    },
  ];

  return (
    <motion.div
      style={{
        position: "relative",
        zIndex: 30,
      }}
      className="w-full h-full bg-[#ff7738] py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#141414] text-center tracking-tighter mb-8 sm:mb-12 md:mb-16"
      >
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        >
          What You Get When
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="text-[#141414]/95 backdrop-blur-lg"
        >
          You Work with Me
        </motion.span>
      </motion.h2>

      <div className="flex flex-col">
        {courseData.map((course, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${
              index === 0 ? "border-b" : "border-t border-b"
            } border-[#141414]`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              className="w-full md:w-1/2 sm:p-6 md:p-8 flex flex-col justify-between"
            >
              <div className="py-2 sm:py-3 md:py-4">
                <div className="mb-2">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                    src={course.titleImage}
                    alt={course.title}
                    className="h-6 sm:h-7 md:h-9 object-cover"
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                  className="text-[#141414] font-clash text-base sm:text-lg mb-4 sm:mb-5 md:mb-6 max-w-2/3 font-medium tracking-tight leading-5 sm:leading-6"
                >
                  {course.description}
                </motion.p>
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                  className="flex items-center text-sm gap-4"
                >
                  <span className="text-[#141414]/60">
                    COURSE {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-[#141414]/60">{course.duration}</span>
                </motion.div> */}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
              className="w-full md:w-1/2 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] relative overflow-hidden sm:p-6 md:p-8 group md:mb-0 mb-4"
            >
              <motion.div className="absolute top-5 left-5 w-4 h-4 border-l-2 border-t-2 border-black/90" />
              <motion.div className="absolute top-5 right-5 w-4 h-4 border-r-2 border-t-2 border-black/90" />
              <motion.div className="absolute bottom-5 left-5 w-4 h-4 border-l-2 border-b-2 border-black/90" />
              <motion.div className="absolute bottom-5 right-5 w-4 h-4 border-r-2 border-b-2 border-black/90" />

              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
              ) : overlayVideos[index + 1]?.contentType === "image" ? (
                <img
                  src={overlayVideos[index + 1]?.url || '/shotfilm.mp4'}
                  alt={overlayVideos[index + 1]?.name || 'Overlay content'}
                  className="w-full h-full object-cover cursor-pointer transition-all duration-200 ease-in group-hover:scale-102"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/thumbnail.png';
                  }}
                />
              ) : (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover cursor-pointer transition-all duration-200 ease-in group-hover:scale-102"
                  style={{ opacity: 0 }}
                  onLoadedData={(e) => {
                    if (e.currentTarget.readyState >= 2) {
                      e.currentTarget.style.opacity = "1";
                    }
                  }}
                  onCanPlay={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {overlayVideos[index + 1]?.url ? (
                    <>
                      <source
                        src={overlayVideos[index + 1]?.url || ''}
                        type="video/mp4"
                      />
                      <source
                        src={overlayVideos[index + 1]?.url.replace('.mp4', '.avi') || ''}
                        type="video/avi"
                      />
                      <source
                        src={overlayVideos[index + 1]?.url.replace('.mp4', '.webm') || ''}
                        type="video/webm"
                      />
                    </>
                  ) : (
                    <>
                      <source src="/shotfilm.mp4" type="video/mp4" />
                      <source src="/shotfilm.avi" type="video/avi" />
                      <source src="/shotfilm.webm" type="video/webm" />
                    </>
                  )}
                  Your browser does not support the video tag.
                </video>
              )}

              {error && !loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md text-sm text-red-600">
                    Failed to load video
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Overlay;
