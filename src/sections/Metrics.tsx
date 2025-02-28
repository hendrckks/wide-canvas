import { motion } from "framer-motion";

const metrics = [
  {
    title: "Hours Behind the Lens",
    value: 9,
    suffix: "k+",
    colSpan: 2,
    delay: 0.2,
    duration: 0.9,
  },
  {
    title: "Years of Experience",
    value: 15,
    suffix: "+",
    colSpan: 1,
    delay: 0.3,
    duration: 0.8,
  },
  {
    title: "Awards and Recognitions",
    value: 13,
    suffix: "+",
    colSpan: 1,
    delay: 0.3,
    duration: 0.8,
  },
  {
    title: "Happy Clients Served",
    value: 200,
    suffix: "+",
    colSpan: 2,
    delay: 0.4,
    duration: 0.8,
  },
];

const Metrics = () => {
  return (
    <div className="w-full dark:bg-black bg-white px-4 lg:px-8 2xl:px-0 dark:text-white text-black py-5 sm:py-8 md:py-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl font-medium text-center tracking-tighter mb-8 sm:mb-10 md:mb-11"
      >
        Professional
        <span className="dark:text-white/30 text-black/40 backdrop-blur-lg">
          Milestones
        </span>
      </motion.h2>
      <div className="container mx-auto grid grid-cols-2 shadow-sm sm:grid-cols-2 md:grid-cols-3 gap-2 border dark:border-white/10 border-black/20 rounded-lg p-2">
        {" "}
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: metric.duration,
              delay: metric.delay,
              ease: "easeOut",
            }}
            className={`p-4 sm:p-6 md:p-8 border dark:border-white/10 border-black/20 rounded-md ${
              metric.colSpan === 2 ? "col-span-2" : "col-span-1"
            } dark:bg-white/4 bg-black/4 backdrop-blur-xl shadow-lg`}
          >
            <h3 className="dark:text-white/70 text-black/80 text-sm sm:text-base mb-2 border-b dark:border-b-white/20 border-b-black/20 py-2 sm:py-3 font-medium">
              {metric.title}
            </h3>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl tracking-tighter dark:text-white text-black/90 font-medium italic">
              <motion.div layout layoutRoot style={{ willChange: "transform" }}>
                {metric.value}
                <span className="dark:text-[#ff6017] text-[#ff6017]/85 font-normal">
                  {metric.suffix}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
