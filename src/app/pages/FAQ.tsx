import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What services do you offer?",
    answer: "We specialize in documentary filmmaking, commercial videography, and creative photography. Our services include concept development, filming, editing, color grading, and final delivery in multiple formats. We also offer drone cinematography and specialized underwater filming for unique perspectives."
  },
  {
    question: "What is your typical project timeline?",
    answer: "Project timelines vary depending on scope and complexity. A typical documentary project takes 4-8 weeks from initial concept to final delivery. Commercial projects usually take 2-4 weeks. We'll provide a detailed timeline during our initial consultation and keep you updated throughout the process."
  },
  {
    question: "What equipment do you use?",
    answer: "We use professional-grade equipment including RED and Blackmagic cinema cameras, premium lenses, DJI drones, professional lighting kits, and state-of-the-art stabilization systems. For audio, we use industry-standard microphones and recorders to ensure the highest quality sound capture."
  },
  {
    question: "Do you travel for projects?",
    answer: "Yes, we are available for both local and international projects. We have experience filming in various locations and conditions across Kenya and beyond. Travel costs will be included in the project quote when applicable."
  },
  {
    question: "How do you handle pricing?",
    answer: "Our pricing is project-based and depends on factors like duration, location, equipment needs, and crew size. We provide detailed quotes after understanding your specific requirements. We offer flexible payment plans and are transparent about all costs involved."
  },
  {
    question: "What is your post-production process?",
    answer: "Our post-production process includes professional editing, color grading, sound design, and motion graphics if needed. We provide two rounds of revisions to ensure the final product meets your vision. All projects are delivered in multiple formats optimized for your intended use."
  },
  {
    question: "Can I see examples of your previous work?",
    answer: "Yes, you can view our portfolio on our website's Works section. We have a diverse range of projects including documentaries, commercials, and creative films. We're happy to provide specific examples relevant to your project during our consultation."
  },
  {
    question: "How do we get started?",
    answer: "The first step is to schedule a consultation through our contact page. During this meeting, we'll discuss your vision, requirements, timeline, and budget. After understanding your needs, we'll provide a detailed proposal including scope of work, timeline, and pricing."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [blurAmount, setBlurAmount] = useState(0);
  const faqHeaderRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          // Reverse the blur calculation so it starts clear and increases as we scroll
          const calculatedBlur = isIntersecting ? 0 : 7;
          setBlurAmount(calculatedBlur);
        });
      },
      {
        root: null,
        threshold: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0],
        rootMargin: "-100px 0px 0px 0px", // Start transition slightly before the header leaves viewport
      }
    );

    if (faqHeaderRef.current) {
      observer.observe(faqHeaderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-full bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        ref={faqHeaderRef}
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
        className="sticky top-0 h-screen flex flex-col items-center justify-between py-20 text-6xl sm:text-7xl md:text-8xl lg:text-7xl italic text-[#ff6017] tracking-tighter z-10 dark:bg-black/5 bg-white/95 dark:backdrop-blur-none backdrop-blur-sm"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex-1 flex items-center justify-center">
            Frequently Asked questions
          </div>
          <p className="dark:text-white/80 text-black text-xs font-medium flex items-center absolute bottom-10 tracking-normal">
            [
            <motion.span
              animate={{
                y: [-2, 4, -2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={16} />
            </motion.span>
            KEEP SCROLLING ]
          </p>
        </div>
      </motion.div>

      <div
        ref={questionsRef}
        className="relative z-20 dark:bg-black bg-white dark:text-white text-black py-20 px-4 sm:px-6 md:px-8 lg:px-10"
      >
        <div className="max-w-5xl mx-auto">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${openIndex === index ? 'border-b dark:border-white/10 border-black/10' : ''}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-4 flex justify-between items-center text-left focus:outline-none group relative overflow-hidden"
              >
                <span className="text-xl sm:text-xl font-medium tracking-tight relative z-10">
                  {item.question}
                </span>
                <div className="flex items-center gap-2 cursor-pointer relative z-10">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: openIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="dark:text-white/60 text-black/60 text-sm dark:font-light font-normal"
                  >
                    [ Show Less ]
                  </motion.span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="dark:text-white/60 text-black/60 text-3xl mt-1 font-light"
                  >
                    +
                  </motion.span>
                </div>
                <motion.div
                  initial={{ y: '-100%' }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-white/5 z-20"
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-6 dark:text-white/60 text-black/60 text-sm leading-relaxed tracking-tight max-w-2xl w-full">
                  {item.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
