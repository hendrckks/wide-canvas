import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import LoadingScreen from "../components/LoadingScreen";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    };

    // For project detail routes, scroll immediately
    if (location.pathname.startsWith("/project/")) {
      scrollToTop();
    } else {
      // For other routes, scroll immediately
      scrollToTop();
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </>
      )}
    </div>
  );
};

export default MainLayout;
