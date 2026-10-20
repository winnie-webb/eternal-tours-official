import "./globals.css";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "opsz"],
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "Jamaica Eternal Tours and Transportation",
  description:
    "Experience the best private tours and reliable airport transfers across Jamaica. Discover the island's hidden gems with comfort and affordability.",
};

export const viewport = {
  themeColor: "#0E2A21",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Header />
        {children}
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#0E2A21",
              color: "#FFFCF6",
              borderRadius: "999px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
