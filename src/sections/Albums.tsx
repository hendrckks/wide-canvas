import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Gallery from "./Gallery";

const Albums = () => {
  const albumsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Get the bounding rectangles
          const albumsRect = albumsRef.current?.getBoundingClientRect();

          if (albumsRect) {
            // Calculate the distance between the centers of both elements

            // Simple intersection check for immediate blur effect
            const isIntersecting = entry.isIntersecting;
            const intersectionRatio = entry.intersectionRatio;
            // Calculate blur based on intersection ratio for smoother transition
            const calculatedBlur = isIntersecting ? (1 - intersectionRatio) * 8 : 0;
            setBlurAmount(calculatedBlur); // Apply dynamic blur based on scroll position
          }
        });
      },
      {
        root: null,
        threshold: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Create many threshold points for smooth animation
        rootMargin: "0px"
      }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-full bg-black">
      <motion.div
        ref={albumsRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="sticky top-0 flex items-center h-screen justify-center text-9xl italic text-[#ff6017] tracking-tighter z-10"
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
      >
        Albums
      </motion.div>
      <div className="relative z-20" ref={galleryRef}>
        <Gallery />
      </div>
    </div>
  );
};

export default Albums;
