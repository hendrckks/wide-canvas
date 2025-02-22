import { motion } from "framer-motion";
import {
  Camera,
  Video,
  Clock,
  MessageSquare,
  Map,
  Palette,
} from "lucide-react";

const perks = [
  {
    icon: Camera,
    title: "High-Quality Photography",
    description:
      "Professional shooting and meticulous editing for stunning, high-resolution results",
  },
  {
    icon: Video,
    title: "Behind-the-Scenes",
    description:
      "Optional footage capturing the creative process and artistry of every shoot",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "Streamlined editing process with flexible delivery options to meet your timeline",
  },
  {
    icon: MessageSquare,
    title: "Personalized Consultation",
    description:
      "In-depth discussion to align vision and create your perfect aesthetic",
  },
  {
    icon: Map,
    title: "Location Scouting",
    description:
      "Finding the perfect backdrop from urban cityscapes to natural settings",
  },
  {
    icon: Palette,
    title: "Creative Direction",
    description:
      "Expert guidance on styling, poses, and mood to bring your vision to life",
  },
];

const Perks = () => {
  return (
    <div className="w-full bg-black py-16 md:py-24">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="text-6xl font-medium text-white text-center tracking-tighter mt-16 mb-16"
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
          className="text-white/40 backdrop-blur-lg"
        >
          You Work with Me
        </motion.span>
      </motion.h2>

      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {perks.map((perk, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-12 border border-white/10 bg-white/4 backdrop-blur-sm group hover:bg-white/8 transition-colors duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[#ff6017]/10 group-hover:bg-[#ff6017]/20 transition-colors duration-300">
                <perk.icon className="w-6 h-6 text-[#ff6017]" />
              </div>
              <div className="flex-1 mt-2">
                <h3 className="text-xl text-white font-medium mb-2">
                  {perk.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-sm italic">
                  {perk.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Perks;
