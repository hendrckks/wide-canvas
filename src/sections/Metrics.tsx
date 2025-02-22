import NumberFlow from "@number-flow/react";
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
    <div className="w-full bg-black py-5 md:py-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-6xl font-medium text-white text-center tracking-tighter mb-11"
      >
        Professional
        <span className="text-white/30 backdrop-blur-lg"> Milestones</span>
      </motion.h2>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-2 border border-white/10 rounded-lg p-2">
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
            className={`p-8 border border-white/10 rounded-md ${
              metric.colSpan === 2 ? 'col-span-2' : 'col-span-1'
            } bg-white/4 backdrop-blur-lg`}
          >
            <h3 className="text-white/70 text-base mb-2 border-b border-b-white/20 py-3 font-medium">
              {metric.title}
            </h3>
            <div className="text-4xl sm:text-5xl md:text-8xl tracking-tighter text-white font-medium italic">
              <motion.div layout layoutRoot>
                <NumberFlow value={metric.value} />
                <span className="text-[#ff6017] font-normal">{metric.suffix}</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
