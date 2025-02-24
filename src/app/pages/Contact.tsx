import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-sm sm:text-xl text-[#ff7738] tracking-tight mb-10">CONTACT ME</h1>
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tighter"
          >
            Have a Cool Project?
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tighter"
          >
            Let's talk
          </motion.h2>
          <motion.a
            href="mailto:info@emailfilm.com"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tighter underline underline-offset-4 text-white/50 hover:text-[#ff7738] transition-colors duration-300 inline-block"
          >
            info@emailfilm.com
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;