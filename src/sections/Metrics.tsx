import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";

const Metrics = () => {
  return (
    <div className="w-full bg-black py-5 md:py-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-6xl text-white text-center tracking-tighter mb-12"
      >
        Professional
        <span className="text-white/30 backdrop-blur-lg"> Milestones</span>
      </motion.h2>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-2 border border-white/10 rounded-lg p-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="p-8 border border-white/10 rounded-md col-span-2 bg-white/4 backdrop-blur-lg"
        >
          <h3 className="text-white/70 text-base mb-2 border-b border-b-white/20 py-3 font-medium">
            Hours Behind the Lens
          </h3>
          <p className="text-4xl sm:text-5xl md:text-8xl tracking-tighter text-white font-medium italic">
            <motion.p layout layoutRoot>
              <NumberFlow value={9} />
              <span className="text-[#ff6017] font-lg font-normal">k+</span>
            </motion.p>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="p-8 border border-white/10 rounded-md col-span-1 bg-white/4 backdrop-blur-lg"
        >
          <h3 className="text-white/70 text-base mb-2 border-b border-b-white/20 py-3 font-medium">
            Years of Experience
          </h3>
          <p className="text-4xl sm:text-5xl md:text-8xl italic tracking-tighter text-white font-medium">
            <motion.p layout layoutRoot>
              <NumberFlow value={15} />
              <span className="text-[#ff6017] font-normal">+</span>
            </motion.p>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="p-8 border border-white/10 rounded-md col-span-1 bg-white/4 backdrop-blur-lg"
        >
          <h3 className="text-white/70 text-base mb-2 border-b border-b-white/20 py-3 font-medium">
            Awards and Recognitions
          </h3>
          <p className="text-4xl sm:text-5xl md:text-8xl italic tracking-tighter text-white font-medium">
            <motion.p layout layoutRoot>
              <NumberFlow value={13} />
              <span className="text-[#ff6017] font-normal">+</span>
            </motion.p>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="p-8 border border-white/10 rounded-md col-span-2 bg-white/4 backdrop-blur-lg"
        >
          <h3 className="text-white/70 text-base mb-2 border-b border-b-white/20 py-3 font-medium">
            Happy Clients Served
          </h3>
          <p className="text-4xl sm:text-5xl md:text-8xl tracking-tighter italic text-white font-medium">
            <motion.p layout layoutRoot>
              <NumberFlow value={200} />
              <span className="text-[#ff6017] font-normal">+</span>
            </motion.p>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Metrics;
