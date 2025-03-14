import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu = ({ isOpen, onClose }: MenuProps) => {
  const { theme, toggleTheme } = useTheme();
  const menuItems = [
    { title: "HOME", path: "/" },
    { title: "ABOUT", path: "/about" },
    { title: "PORTFOLIO", path: "/works" },
    { title: "CONTACT", path: "/contact" },
    { title: "FAQ", path: "/faq" },
  ];

  const handleWatchTrailer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const heroSection = document.querySelector("#hero");
    heroSection?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const videoPlayerButton = heroSection?.querySelector("button");
      videoPlayerButton?.click();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 w-screen bg-black z-50"
        >
          <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 fixed top-0 left-0 z-50 py-4 h-screen w-screen flex flex-col justify-between dark:bg-black bg-white">
            <div className="flex justify-between items-center w-full">
              <Link to="/">
                <img src={theme === "dark" ? "/wc1.webp" : "/WCBLACK.webp"} className="h-5 sm:h-6" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 leading-3.5">
                <button
                  onClick={onClose}
                  className="text-xs shadow-xl text-center hover:scale-[1.05] transform transition-all duration-350 flex items-center justify-center px-3 sm:px-4 md:px-6 py-2 font-medium rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 hover:border-black relative overflow-hidden group duration-200 cursor-pointer min-w-[70px] sm:min-w-[80px]"
                  style={{ isolation: "isolate" }}
                >
                  <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1 sm:gap-2">
                    CLOSE
                  </span>
                  <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in" />
                </button>
                <button
                  onClick={handleWatchTrailer}
                  className="text-xs shadow-lg hover:shadow-xl hover:scale-[1.05] transform transition-all duration-250 px-4 sm:px-5 md:px-8 py-2 flex gap-1 sm:gap-2 items-center justify-center rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 relative overflow-hidden group duration-200 hover:border-black cursor-pointer min-w-[120px] sm:min-w-[140px]"
                  style={{
                    isolation: "isolate",
                  }}
                >
                  <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    WATCH TRAILER
                    <ArrowUpRight
                      size={10}
                      className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4"
                    />
                  </span>
                  <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
                </button>
              </div>
            </div>

            <nav className="flex-1 flex items-center justify-center w-full">
              <motion.ul className="space-y-1 w-full max-w-screen-2xl">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.18,
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`text-5xl md:text-6xl lg:text-7xl tracking-tighter transition-colors duration-200 flex items-center gap-2 sm:gap-4 group
                        ${
                          location.pathname === item.path
                            ? "text-[#ff6017]"
                            : "dark:text-white text-black/80"
                        }
                        dark:hover:text-white/40 hover:text-black/40
                      `}
                    >
                      {item.title}
                      <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-3 sm:mb-5" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div className="flex flex-col gap-4">
              <button
                onClick={toggleTheme}
                className="sm:hidden text-xs shadow-lg hover:shadow-xl hover:scale-[1.05] transform transition-all duration-250 px-4 py-2 flex gap-1 sm:gap-2 items-center justify-center rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 relative overflow-hidden group duration-200 hover:border-black cursor-pointer min-w-[100px] sm:min-w-[120px] mx-auto mb-4"
                style={{ isolation: "isolate" }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1 sm:gap-2">
                  {theme === "dark" ? <Sun size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <Moon size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
                  {theme === "dark" ? "LIGHT" : "DARK"}
                </span>
                <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
              </button>
              <div className="text-[#808080] sm:text-xs tracking-tight font-medium text-start">
                © 2025 Wide Canvas | Live to Put Memories
                <br /> on a Widecanvas. | All rights reserved.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
