import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import ElfSightWidget from "./components/Elfsight";
import Category from "./components/Category";
import AboutUs from "./components/AboutUs";
import { TripAdvisor } from "./components/TripAdvisor";
import BtmGallery from "./components/BtmGallery";

export default function Home() {
  return (
    <>
      <Hero />
      <TripAdvisor></TripAdvisor>
      <Gallery />
      <ElfSightWidget />
      <Category
        title="Most Popular Tours"
        categoryFilter="mpt"
        itemsPerPage={3}
      ></Category>
      <Category
        title="Airport Transfers"
        categoryFilter="at"
        itemsPerPage={3}
      ></Category>
      <AboutUs />
      <BtmGallery></BtmGallery>
    </>
  );
}
