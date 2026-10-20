import AboutUs from "../components/AboutUs";
import Gallery from "../components/Gallery";
import HowItWorks from "../components/HowItWorks";

export const metadata = {
  title: "About · Jamaica Eternal Tours",
};

function page() {
  return (
    <main>
      <AboutUs full />
      <HowItWorks />
      <Gallery />
    </main>
  );
}

export default page;
