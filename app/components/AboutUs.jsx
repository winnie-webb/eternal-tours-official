import Image from "next/image";
import React from "react";

function AboutUs() {
  return (
    <section className="p-4 my-8 md:p-10 xl:w-[85%] 2xl:w-[70%] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="md:flex-[55%]">
          <h2 className="font-bold text-3xl md:text-4xl  md:mb-8">
          Get to know us
          </h2>
          <p className="font-medium text-lg md:leading-8">
          At Jamaica Eternal Tours, we specialize in uncovering the hidden gems of Jamaica, offering tailored experiences that showcase the island’s beauty, culture, and heritage. From airport transfers to beach escapes and cultural explorations, we provide personalized, expert-guided tours that suit every traveler. Let us take you on an unforgettable journey through Jamaica’s stunning landscapes and iconic attractions, ensuring your comfort and convenience every step of the way.
</p>          </div>
        <div className="relative w-90 h-72 md:flex-[45%] md:mt-14 md:h-[22rem] ">
          <Image
            alt="Image of Founder with clients from Jamaica Eternal Tours"
            src="/local/hero-1.jpg"
            fill={true}
            className="object-cover"
          ></Image>
        </div>
      </div>
      <div className="flex mt-20 md:mt-20  flex-col md:flex-row justify-between gap-4">
        <div className="md:flex-[50%]">
          <h3 className="font-bold text-3xl md:mb-8 mb-4">Our Mission</h3>
          <p className="font-medium text-base md:leading-7">
          To empower travelers to explore Jamaica’s finest tours, creating meaningful connections and unforgettable experiences while promoting responsible and sustainable tourism practices.          </p>
        </div>
        <div className="md:flex-[50%]">
          <h3 className="font-bold text-3xl md:mb-8 mb-4">Our Vision</h3>
          <p className="font-medium text-base md:leading-7">
          Our vision is to inspire transformative adventures in Jamaica, fostering appreciation for diverse cultures and contributing to a sustainable, interconnected planet through travel joy.

</p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
