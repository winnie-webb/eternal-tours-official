import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className="p-4  bg-emerald-300 flex justify-center md:p-10">
      <div className="w-full xl:w-[85%] 2xl:w-[65%] mx-auto">
        <div className="flex flex-col  md:flex-row justify-evenly w-full">
          <div className="flex-[55%]">
            <h4 className="mb-2 font-bold">Contacts</h4>
            <p className="mb-2">eternaltours876@gmail.com</p>
            <p>+1 (876) 855-9645</p>
          </div>
          <div className=" flex-[45%] mt-4 md:mt-0">
            <h4 className="mb-2 font-bold">Socials</h4>
            <div className="flex gap-x-5">
              <a target="_blank" href="https://www.tiktok.com/@eternaltours.ja">
                <FaTiktok className="text-3xl" />
              </a>
              <a
                target="_blank"
                href="https://www.facebook.com/desmond.brown.756859"
              >
                <FaFacebook className="text-3xl" />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/jamaica_eternal_tours/"
              >
                <FaInstagram className="text-3xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
