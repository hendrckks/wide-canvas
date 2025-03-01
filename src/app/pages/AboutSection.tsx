"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <main className="min-h-screen dark:bg-black bg-white dark:text-white text-black">      {/* Hero Section with Marvin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12 sm:py-16 md:py-24 px-4 md:px-8">
        <div className="flex flex-col justify-between relative pb-16 md:pb-0">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-8xl leading-tight md:leading-20 tracking-tighter mb-4 opacity-80 dark:text-white text-black">
              Meet Marvin, Founder of Widecanvas
            </h1>
            <div className="w-36 sm:w-56 h-0.5 bg-black/80 dark:bg-white/60 my-4 sm:my-6"></div>
            <p className="mt-4 sm:mt-6 max-w-md text-sm sm:text-base font-medium opacity-90">
              Marvin, 21, is the visionary founder of Widecanvas, capturing
              life&apos;s fleeting moments with an eye beyond his years. His
              pioneering approach blends documentaries and cinematography with his own unique style, creating visual
              stories that have defined the Widecanvas aesthetic of authenticity and raw emotion.
            </p>
          </div>
          <p className="dark:text-white/80 text-black/80 text-xs font-medium flex items-center absolute bottom-0 tracking-normal">
            [
            <motion.span
              animate={{
                y: [-2, 4, -2],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={16} />
            </motion.span>
            KEEP SCROLLING ]
          </p>
        </div>
        <div className="relative h-[400px] sm:h-[500px] md:h-[610px] flex items-center mt-6 md:mt-0">
          <div className="absolute -left-2 sm:-left-4 md:-left-[75px] h-full flex items-center">
            <h2
              className="vertical-text transform -rotate-180 text-5xl sm:text-7xl md:text-[170px] font-light tracking-tighter opacity-80 dark:text-white text-black"
              style={{ writingMode: "vertical-rl" }}
            >
              Marvin
            </h2>
          </div>
          <div className="w-full h-full rounded-sm relative ml-8 sm:ml-12 md:ml-20">
            <img
              src="/marvo.webp"
              alt="Marvin with his camera"
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-4 sm:p-8 py-12 sm:py-20">
        {/* About Content */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 mb-16 sm:mb-24">
          <h2 className="text-sm font-medium">ABOUT</h2>
          <div className="space-y-8 sm:space-y-12 max-w-3xl">
            <p className="text-xs sm:text-sm leading-relaxed font-semibold">
              I BELIEVE IN THE POWER OF VISUAL STORYTELLING AND CAPTURING
              AUTHENTIC MOMENTS. EVERY FRAME SHOULD FREEZE A MEMORY, EVERY
              PHOTOGRAPH SHOULD TELL A STORY, AND EVERY IMAGE SHOULD EVOKE
              EMOTION. MY APPROACH COMBINES ARTISTIC VISION WITH TECHNICAL
              PRECISION, CREATING PHOTOGRAPHS THAT ARE NOT JUST VISUALLY
              STRIKING, BUT ALSO MEANINGFUL AND IMPACTFUL.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed font-semibold">
              I STRIVE TO REVEAL THE TRUTH IN EACH SUBJECT, TRANSLATING FLEETING
              MOMENTS INTO TIMELESS IMAGES THAT RESONATE WITH VIEWERS. FOR ME,
              GREAT PHOTOGRAPHY IS NOT JUST ABOUT COMPOSITION—IT'S ABOUT
              CREATING GENUINE CONNECTIONS AND PRESERVING MOMENTS THAT MIGHT
              OTHERWISE BE LOST TO TIME.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 mb-16 sm:mb-24">
          <h2 className="text-sm font-medium">MY SERVICES</h2>
          <div className="space-y-2 text-xs sm:text-sm font-semibold">
            <p>PORTRAIT PHOTOGRAPHY</p>
            <p>DOCUMENTARY FILMMAKING</p>
            <p>CINEMATOGRAPHY</p>
            <p>EVENT COVERAGE</p>
            <p>PHOTO & VIDEO EDITING</p>
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 mb-16 sm:mb-24">
          <h2 className="text-sm font-medium">
            COMPANIES I HAVE WORKED <br className="hidden sm:block" />
            WITH / FOR
          </h2>
          <div className="space-y-2 text-xs sm:text-sm font-semibold">
            <p>LOCAL GALLERY</p>
            <p>STUDENT MAGAZINE</p>
            <p>INDIE MUSIC FESTIVAL</p>
            <p>CAMPUS EVENTS</p>
            <p>URBAN OUTFITTERS</p>
          </div>
        </section>

        {/* Experience Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 items-end">
          <h2 className="text-sm font-medium">EXPERIENCE</h2>
          <div className="flex justify-between items-end text-xs sm:text-sm">
            <div className="text-xs sm:text-sm font-semibold">
              <p>FOUNDER & LEAD PHOTOGRAPHER</p>
              <p>WIDECANVAS STUDIO</p>
              <p>2021-PRESENT</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
