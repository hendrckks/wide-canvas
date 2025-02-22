import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import Menu from "./Menu";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      className={`w-full flex items-center justify-between bg-gradient-to-b from-white/5 via-white/2 to-transparent backdrop-blur-md px-3 sm:px-4 md:px-6 lg:px-8 fixed top-0 left-0 z-50 py-3 sm:py-4 transition-transform duration-300 ease-in-out ${
        !isVisible ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <h1 className="text-base sm:text-lg md:text-xl text-white font-semibold italic">
        WIDE. CANVAS.
      </h1>
      <div className="flex items-center gap-3 sm:gap-6 md:gap-8 leading-3.5">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-[10px] sm:text-xs flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 font-medium rounded-full border text-white border-white/40 relative overflow-hidden group transition-colors duration-200 hover:border-transparent"
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
          className="text-[10px] sm:text-xs px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 flex gap-1 sm:gap-2 items-center rounded-full border text-white border-white/40 relative overflow-hidden group transition-colors duration-200 hover:border-transparent cursor-pointer"
          style={{
            isolation: "isolate",
          }}
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-200 flex items-center gap-1 sm:gap-2">
            WATCH TRAILER
            <ArrowUpRight size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </span>
          <div className="absolute inset-0 bg-[#ff6017] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out group-hover:ease-in"></div>
        </button>
      </div>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Header;
