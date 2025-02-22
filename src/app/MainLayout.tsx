import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import LoadingScreen from "../components/LoadingScreen";
import { useState } from "react";

const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
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
        </>
      )}
    </div>
  );
};

export default MainLayout;
