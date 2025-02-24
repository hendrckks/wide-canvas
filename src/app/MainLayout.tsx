import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import LoadingScreen from "../components/LoadingScreen";
import { useEffect, useState } from "react";
import Footer from "../sections/Footer";

const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default MainLayout;
