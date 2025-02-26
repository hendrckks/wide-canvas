import { motion } from "framer-motion";

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
        className="text-6xl font-medium text-[#141414] text-center tracking-tighter mb-16"
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
        {[
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
        ].map((course, index) => (
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
                    className="h-9 object-cover"
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                  className="text-[#141414] font-clash text-lg mb-6 max-w-2/3 font-medium tracking-tight leading-6"
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
              className="w-full md:w-1/2 h-[300px] md:h-[400px] relative overflow-hidden p-8 group"
            >
              <motion.div className="absolute top-5 left-5 w-4 h-4 border-l-2 border-t-2 border-black/90" />
              <motion.div className="absolute top-5 right-5 w-4 h-4 border-r-2 border-t-2 border-black/90" />
              <motion.div className="absolute bottom-5 left-5 w-4 h-4 border-l-2 border-b-2 border-black/90" />
              <motion.div className="absolute bottom-5 right-5 w-4 h-4 border-r-2 border-b-2 border-black/90" />
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                // loading="lazy"
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
                <source src="/shotfilm.mp4" type="video/mp4" />
                <source src="/shotfilm.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Overlay;
