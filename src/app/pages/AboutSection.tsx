"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <main className="min-h-screen dark:bg-black bg-white dark:text-white text-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12 sm:py-16 md:py-24 px-4 md:px-8"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col justify-center relative pb-16 md:pb-0"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-8xl leading-tight md:leading-20 tracking-tighter mb-4 opacity-80 dark:text-white text-black"
            >
              Meet Marvin, Founder of Widecanvas
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="w-36 sm:w-56 h-0.5 bg-black/80 dark:bg-white/60 my-4 sm:my-6"
              style={{ transformOrigin: "left" }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="mt-4 sm:mt-6 max-w-md text-sm sm:text-base font-medium opacity-90"
            >
              Marvin, 21, is the visionary founder of Widecanvas, capturing
              life&apos;s fleeting moments with an eye beyond his years. His
              pioneering approach blends documentaries and cinematography with his own unique style, creating visual
              stories that have defined the Widecanvas aesthetic of authenticity and raw emotion.
            </motion.p>
          </div>
          <p className="dark:text-white/80 text-black/80 text-xs font-medium flex items-center absolute bottom-0 tracking-normal">
            [
            <motion.span
              animate={{ y: [-2, 4, -2] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <ArrowDown size={16} />
            </motion.span>
            KEEP SCROLLING ]
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative h-[400px] sm:h-[500px] md:h-[610px] flex items-center mt-6 md:mt-0"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="absolute -left-2 sm:-left-4 md:-left-[75px] h-full flex items-center"
          >
            <h2
              className="vertical-text transform -rotate-180 text-5xl sm:text-7xl md:text-[170px] font-light tracking-tighter opacity-80 dark:text-white text-black"
              style={{ writingMode: "vertical-rl" }}
            >
              Marvin
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="w-full h-full rounded-sm relative ml-8 sm:ml-12 md:ml-20"
          >
            <img
              src="/marvo.webp"
              alt="Marvin with his camera"
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-4 sm:p-8 py-12 sm:py-20"
      >
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 mb-16 sm:mb-24"
        >
          <h2 className="text-sm font-medium">ABOUT</h2>
          <div className="space-y-8 sm:space-y-12 max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs sm:text-sm leading-relaxed font-semibold"
            >
              I BELIEVE IN THE POWER OF VISUAL STORYTELLING AND CAPTURING
              AUTHENTIC MOMENTS. EVERY FRAME SHOULD FREEZE A MEMORY, EVERY
              PHOTOGRAPH SHOULD TELL A STORY, AND EVERY IMAGE SHOULD EVOKE
              EMOTION. MY APPROACH COMBINES ARTISTIC VISION WITH TECHNICAL
              PRECISION, CREATING PHOTOGRAPHS THAT ARE NOT JUST VISUALLY
              STRIKING, BUT ALSO MEANINGFUL AND IMPACTFUL.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs sm:text-sm leading-relaxed font-semibold"
            >
              I STRIVE TO REVEAL THE TRUTH IN EACH SUBJECT, TRANSLATING FLEETING
              MOMENTS INTO TIMELESS IMAGES THAT RESONATE WITH VIEWERS. FOR ME,
              GREAT PHOTOGRAPHY IS NOT JUST ABOUT COMPOSITION—IT'S ABOUT
              CREATING GENUINE CONNECTIONS AND PRESERVING MOMENTS THAT MIGHT
              OTHERWISE BE LOST TO TIME.
            </motion.p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 mb-16 sm:mb-24"
        >
          <h2 className="text-sm font-medium">MY SERVICES</h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-2 text-xs sm:text-sm font-semibold"
          >
            {["PORTRAIT PHOTOGRAPHY", "DOCUMENTARY FILMMAKING", "CINEMATOGRAPHY", "EVENT COVERAGE", "PHOTO & VIDEO EDITING"].map((service, index) => (
              <motion.p
                key={service}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                {service}
              </motion.p>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 mb-16 sm:mb-24"
        >
          <h2 className="text-sm font-medium">
            COMPANIES I HAVE WORKED <br className="hidden sm:block" />
            WITH / FOR
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-2 text-xs sm:text-sm font-semibold"
          >
            {["LOCAL GALLERY", "STUDENT MAGAZINE", "INDIE MUSIC FESTIVAL", "CAMPUS EVENTS", "URBAN OUTFITTERS"].map((company, index) => (
              <motion.p
                key={company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                {company}
              </motion.p>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[200px,1fr] gap-6 sm:gap-10 md:gap-16 items-end"
        >
          <h2 className="text-sm font-medium">EXPERIENCE</h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-between items-end text-xs sm:text-sm"
          >
            <div className="text-xs sm:text-sm font-semibold">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                FOUNDER & LEAD PHOTOGRAPHER
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                WIDECANVAS STUDIO
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                2021-PRESENT
              </motion.p>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </main>
  );
}
