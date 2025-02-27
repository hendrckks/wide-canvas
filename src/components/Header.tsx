import { useEffect, useState } from "react";
import Menu from "./Menu";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 150; // Number of pixels to trigger visibility change

      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
    <div
      className={`w-screen flex items-center justify-between bg-gradient-to-b dark:from-white/5 from-black/10 dark:via-white/2 via-black/5  to-transparent backdrop-blur-md px-2 sm:px-3 md:px-6 lg:px-8 fixed top-0 left-0 z-50 py-4 sm:py-3 md:py-4 transition-transform duration-300 ease-in-out ${
        !isVisible ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Link to="/">
        <img
          src={theme === "dark" ? "/wc1.webp" : "/WCBLACK.webp"}
          className="h-5 sm:h-6"
        />
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 leading-3.5">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-xs shadow-xl text-center hover:scale-[1.05] transform transition-all duration-350 flex items-center justify-center px-3 sm:px-4 md:px-6 py-2 font-medium rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 hover:border-black relative overflow-hidden group duration-200 cursor-pointer min-w-[70px] sm:min-w-[80px]"
          style={{
            isolation: "isolate",
          }}
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-200">
            MENU
          </span>
          <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
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
            <ArrowUpRight size={10} className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4" />
          </span>
          <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
        </button>
        <button
          onClick={toggleTheme}
          className="hidden sm:flex text-[9px] sm:text-[10px] md:text-xs hover:scale-[1.04] shadow-md items-center px-3 sm:px-4 md:px-5 py-1.5 md:py-2 font-medium rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 hover:border-black relative overflow-hidden group transition-all duration-200 cursor-pointer min-w-[70px] sm:min-w-[80px]"
          style={{ isolation: "isolate" }}
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1">
            {theme === "dark" ? <Sun size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <Moon size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
            {theme === "dark" ? "LIGHT" : "DARK"}
          </span>
          <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
        </button>
      </div>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Header;
