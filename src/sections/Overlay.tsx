import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Overlay = () => {
  return (
    <motion.div
      style={{
        position: "relative",
        zIndex: 30,
      }}
      className="w-full h-full bg-[#ff7738] py-20 px-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-6xl font-medium text-[#141414] text-center tracking-tighter mb-10"
      >
        Wait... There's more!
      </motion.h2>
      <div className="flex flex-col">
        {[
          {
            title: "MASTER THE BASICS™",
            titleImage: "/master2.png",
            description:
              "Essential fundamentals of photography and cinematography for beginners.",
            duration: "42 VIDEOS (12 HOURS)",
          },
          {
            title: "ADVANCED TECHNIQUES™",
            titleImage: "/advanced.png",
            description:
              "Deep dive into professional lighting, composition, and advanced camera operations.",
            duration: "56 VIDEOS (15 HOURS)",
          },
          {
            title: "POST-PRODUCTION PRO™",
            titleImage: "/master1.png",
            description:
              "Expert-level editing, color grading, and visual effects mastery.",
            duration: "64 VIDEOS (18 HOURS)",
          },
          {
            title: "BUSINESS OF FILM™",
            titleImage: "/advanced.png",
            description:
              "Complete guide to building a successful photography and film business.",
            duration: "48 VIDEOS (14 HOURS)",
          },
        ].map((course, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${
              index === 0 ? "border-b" : "border-t border-b"
            } border-[#141414]/40`}
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
              className="w-full md:w-1/2 p-8 flex flex-col justify-between"
            >
              <div className="py-4">
                <div className="mb-2">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                    src={course.titleImage}
                    alt={course.title}
                    className="h-9 object-contain"
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                  className="text-[#141414]/80 text-lg mb-6 max-w-2/3 font-medium tracking-tight leading-6"
                >
                  {course.description}
                </motion.p>
                <motion.div
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
                </motion.div>
              </div>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                className="text-xs flex items-center px-6 py-3 rounded-full border text-white bg-black border-transparent hover:border-black relative overflow-hidden group transition-colors duration-200 cursor-pointer w-fit"
                style={{
                  isolation: "isolate",
                }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1 sm:gap-2">
                  EXPLORE
                  <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0 bg-white -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in" />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
              className="w-full md:w-1/2 h-[300px] md:h-[400px] relative overflow-hidden p-8"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{ opacity: 0 }}
                onCanPlay={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <source src="/shotfilm.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Overlay;
