"use client";
import React, { useState } from "react";
import logo from "../../public/logo.webp";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu
  const [isToursMenuOpen, setIsToursMenuOpen] = useState(false);
  const currentPath = usePathname();

  // Toggle menu open state
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to check if link is active
  const isActive = (href) => currentPath === href;

  return (
    <header className="flex relative z-50 flex-col xl:flex-row justify-between items-center p-5 xl:p-10 gap-y-4 xl:gap-x-10">
      {/* Logo */}
      <div className="flex justify-between items-center w-full xl:w-auto">
        <Link href="/">
          <Image
            width={150}
            height={150}
            alt="Island Ways Tours Logo"
            src={logo}
          />
        </Link>
        {/* Hamburger menu for small screens */}
        <button
          className="xl:hidden text-3xl"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />} {/* Toggle between icons */}
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Navigation (Hidden on small screens, visible on large) */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } top-[100%] absolute xl:relative xl:flex xl:pt-4 justify-evenly items-center gap-x-4 flex-1 bg-white z-40 w-full p-4 pt-0`}
      >
        <nav
          className={` flex flex-col  xl:flex  xl:flex-row xl:items-center gap-y-4 xl:gap-x-5  w-full xl:w-auto`}
        >
          <div className=" relative">
            <span
              onClick={() => setIsToursMenuOpen(!isToursMenuOpen)}
              className="cursor-pointer flex items-center"
            >
              Tours
              {isToursMenuOpen ? (
                <RiArrowDropUpFill className="text-4xl" />
              ) : (
                <RiArrowDropDownFill className="text-4xl" />
              )}
            </span>
            <div
              className={`absolute rounded transition-transform ${
                isToursMenuOpen ? "flex" : "hidden"
              } flex-col gap-y-2 top-7 left-0 w-60 shadow-md p-4 bg-white text-black z-50`}
            >
              <Link
                href="/category/mpt"
                className={
                  isActive("/mpt") ? "underline underline-offset-8" : ""
                }
              >
                Most Popular Tours
              </Link>
              <Link
                href="/category/at"
                className={
                  isActive("/at") ? "underline underline-offset-8" : ""
                }
              >
                Airport Transfers
              </Link>
              <Link
                href="/category/ctp"
                className={
                  isActive("/ctp") ? "underline underline-offset-8" : ""
                }
              >
                Combo Tour Packages
              </Link>
              <Link
                href="/category/abc"
                className={
                  isActive("/abc") ? "underline underline-offset-8" : ""
                }
              >
                Attractions / Beach / City Tours
              </Link>
              <Link
                href="/category/cse"
                className={
                  isActive("/cse") ? "underline underline-offset-8" : ""
                }
              >
                Cruise Shore Excursions
              </Link>
              <Link
                href="/category/edt"
                className={
                  isActive("/edt") ? "underline underline-offset-8" : ""
                }
              >
                Eating / Dining Tours
              </Link>
              <Link
                href="/category/egt"
                className={
                  isActive("/egt") ? "underline underline-offset-8" : ""
                }
              >
                Exclusive Golf Tours
              </Link>
              <Link
                href="/category/ncb"
                className={
                  isActive("/ncb") ? "underline underline-offset-8" : ""
                }
              >
                Night Life / Casino / Bar Tours
              </Link>
              <Link
                href="/category/st"
                className={
                  isActive("/st") ? "underline underline-offset-8" : ""
                }
              >
                Shopping Tours
              </Link>
            </div>
          </div>
          <Link
            href="/pay"
            className={isActive("/pay") ? "underline underline-offset-8" : ""}
          >
            Payments
          </Link>
          <Link
            href="/about-us"
            className={
              isActive("/about-us") ? "underline underline-offset-8" : ""
            }
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            className={
              isActive("/contact-us") ? "underline underline-offset-8" : ""
            }
          >
            Contact Us
          </Link>
        </nav>

        {/* Social Icons (Visible on large screens) */}
        <div className="hidden xl:flex gap-x-5 justify-between">
          <a target="_blank" href="https://www.tiktok.com/@eternaltours.ja">
            <FaTiktok className="text-3xl" />
          </a>
          <a
            target="_blank"
            href="https://www.facebook.com/desmond.brown.756859"
          >
            <FaFacebook className="text-3xl" />
          </a>
          <a target="_blank" href="https://www.instagram.com/jamaica_eternal_tours/">
            <FaInstagram className="text-3xl" />
          </a>
        </div>

        {/* Social Icons for mobile view (Visible on small screens when menu is open) */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } xl:hidden flex gap-x-5 justify-center mt-5`}
        >
          <a target="_blank" href="https://www.tiktok.com/@eternaltours.ja">
            <FaTiktok className="text-3xl" />
          </a>
          <a
            target="_blank"
            href="https://www.facebook.com/desmond.brown.756859"
          >
            <FaFacebook className="text-3xl" />
          </a>
          <a target="_blank" href="https://www.instagram.com/jamaica_eternal_tours/">
            <FaInstagram className="text-3xl" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
