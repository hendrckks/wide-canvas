import Albums from "../../sections/Albums";
import Hero from "../../sections/Hero";
import Metrics from "../../sections/Metrics";

const Home = () => {
  return (
    <div className="bg-black overflow-clip">
      <Hero />
      <Metrics />
      <Albums />
    </div>
  );
};

export default Home;
