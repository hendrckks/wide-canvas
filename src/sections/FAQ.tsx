import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is AOD?",
    answer:
      "Art of Documentary is an online film academy of over 5000+ filmmakers from around the world who are passionate about telling untold stories and building profitable film careers. When a filmmaker joins any of the AOD™ courses, they not only get access to dozens of hours of focused and practical teaching videos that can be watched at leisure, but they receive lifetime access to our private and highly active global Facebook group where job postings, work collabs, and rough cut reviews are posted daily. AOD™ members also get access to our exclusive monthly industry calls where we bring in experts from around the industry to teach and do Q&A live on Zoom.",
  },
  {
    question: "Who can join AOD?",
    answer:
      "Anyone passionate about documentary filmmaking can join AOD. Whether you're a complete beginner or an experienced filmmaker looking to enhance your skills, our courses are designed to accommodate all skill levels.",
  },
  {
    question: "Can I share my account?",
    answer:
      "No, AOD accounts are for individual use only. Each subscription is tied to a single user to ensure the best learning experience and maintain the quality of our community.",
  },
  {
    question: "Can I take multiple courses at once?",
    answer:
      "Yes, you can enroll in multiple courses simultaneously. Our platform is designed to let you learn at your own pace and take as many courses as you'd like.",
  },
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
        className="sticky top-0 h-screen flex flex-col items-center justify-between py-20 text-6xl sm:text-7xl md:text-8xl lg:text-7xl italic text-[#ff6017] tracking-tighter z-10 bg-black/5"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex-1 flex items-center justify-center">
            Frequently Asked questions
          </div>
          <p className="text-white/80 text-xs font-medium flex items-center absolute bottom-10 tracking-normal">
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
        className="relative z-20 bg-black py-20 px-4 sm:px-6 md:px-8 lg:px-10"
      >
        <div className="max-w-5xl mx-auto">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${openIndex === index ? 'border-b border-white/10' : ''}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-4 flex justify-between items-center text-left focus:outline-none group relative overflow-hidden"
              >
                <span className="text-xl sm:text-xl text-white font-medium tracking-tight relative z-10">
                  {item.question}
                </span>
                <div className="flex items-center gap-2 cursor-pointer relative z-10">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: openIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/60 text-sm font-light"
                  >
                    [ Show Less ]
                  </motion.span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/60 text-3xl mt-1 font-light"
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
                <p className="pb-6 text-white/60 text-sm leading-relaxed tracking-tight">
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
