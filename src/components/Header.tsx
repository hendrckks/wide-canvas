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
      className={`w-screen flex items-center justify-between bg-gradient-to-b dark:from-white/5 from-black/10 dark:via-white/2 via-black/5  to-transparent backdrop-blur-md px-3 sm:px-4 md:px-6 lg:px-8 fixed top-0 left-0 z-50 py-3 sm:py-4 transition-transform duration-300 ease-in-out ${
        !isVisible ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* <h1 className="text-base sm:text-lg md:text-xl text-white font-semibold italic">
        WIDE. CANVAS.
      </h1> */}
      <Link to="/">
        <img
          src={theme === "dark" ? "/wc1.png" : "/WCBLACK.png"}
          className="h-6"
        />
      </Link>
      <div className="flex items-center gap-3 sm:gap-4 md:gap-4 leading-3.5">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-[10px] sm:text-xs flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 font-medium rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 hover:border-black relative overflow-hidden group transition-colors duration-200 cursor-pointer"
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
          className="text-[10px] sm:text-xs px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 flex gap-1 sm:gap-2 items-center rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 relative overflow-hidden group transition-colors duration-200 hover:border-black cursor-pointer"
          style={{
            isolation: "isolate",
          }}
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1 sm:gap-2">
            WATCH TRAILER
            <ArrowUpRight size={10} className="sm:w-4 sm:h-4 md:w-4 md:h-4" />
          </span>
          <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
        </button>
        <button
          onClick={toggleTheme}
          className="text-[10px] sm:text-xs flex items-center px-3 sm:px-4 md:px-4 py-1.5 sm:py-2 font-medium rounded-full border dark:text-white text-black dark:border-white/40 border-black/40 hover:border-black relative overflow-hidden group transition-colors duration-200 cursor-pointer"
          style={{ isolation: "isolate" }}
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
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
