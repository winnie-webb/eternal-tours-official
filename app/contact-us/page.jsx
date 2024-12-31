"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const form = useRef();
  const [isMsgSent, setIsMsgSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_kmd66k9",
        "template_ncl1a7a",
        form.current,
        "7pjYjqAMh02paFyYr"
      )
      .then(
        () => {
          setIsMsgSent(true);
        },
        (error) => {
          console.error("Error sending email:", error);
          setIsMsgSent(true);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        {!isMsgSent && (
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Contact Us
          </h2>
        )}

        {!isMsgSent ? (
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition duration-200"
            >
              Send Message
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-emerald-600">
              Thank you!
            </h3>
            <p className="text-gray-700 mt-4">
              Your message has been sent successfully. We’ll get back to you
              shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
