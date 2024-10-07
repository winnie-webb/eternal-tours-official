import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Jamaica Eternal Tours and Transportation",
  description:
    "Experience the best private tours and reliable airport transfers across Jamaica. Discover the island's hidden gems with comfort and affordability.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
