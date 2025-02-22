import Albums from "../../sections/Albums";
import Hero from "../../sections/Hero";
import Metrics from "../../sections/Metrics";
import Perks from "../../sections/Perks";

const Home = () => {
  return (
    <div className="bg-black overflow-clip">
      <Hero />
      <Metrics />
      <Albums />
      <Perks />
    </div>
  );
};

export default Home;
