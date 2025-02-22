import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu = ({ isOpen, onClose }: MenuProps) => {
  const menuItems = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Portfolio", path: "/portfolio" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-black z-50"
        >
          <div className="container px-3 sm:px-4 md:px-6 lg:px-8 fixed top-0 left-0 z-50 py-3 sm:py-4 h-screen  flex flex-col justify-between bg-black">
            <div className="flex justify-between items-center">
              <h1 className="text-base sm:text-lg md:text-xl text-white font-semibold italic">
                WIDE. CANVAS.
              </h1>
              <button
                onClick={onClose}
                className="text-[10px] sm:text-xs px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 flex gap-1 sm:gap-2 items-center rounded-full border text-white border-white/40 relative overflow-hidden group transition-colors duration-200 hover:border-transparent cursor-pointer"
                style={{ isolation: "isolate" }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1 sm:gap-2">
                  CLOSE
                  <ArrowUpRight size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </span>
                <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in" />
              </button>
            </div>

            <nav className="flex-1 flex items-center justify-center">
              <motion.ul className="space-y-6 text-center">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.18 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className="text-4xl md:text-6xl lg:text-8xl text-white hover:text-[#ff6017] tracking-tighter transition-colors duration-200 flex items-center gap-4 group"
                    >
                      {item.title}
                      <ArrowUpRight
                        className="w-8 h-8 md:w-12 md:h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div className="text-white/50 text-sm tracking-tight text-center">
              © 2024 Wide Canvas. All rights reserved.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;