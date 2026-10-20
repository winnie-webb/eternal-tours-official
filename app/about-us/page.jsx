import AboutUs from "../components/AboutUs";
import Gallery from "../components/Gallery";

export const metadata = {
  title: "About · Jamaica Eternal Tours",
};

function page() {
  return (
    <main>
      <AboutUs full />
      <Gallery />
    </main>
  );
}

export default page;
