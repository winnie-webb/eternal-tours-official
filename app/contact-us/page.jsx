"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FiLoader, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { CONTACT, SocialLinks } from "../components/SocialLinks";

const ContactUs = () => {
  const form = useRef();
  const [isMsgSent, setIsMsgSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    emailjs
      .sendForm("service_kmd66k9", "template_ncl1a7a", form.current, "7pjYjqAMh02paFyYr")
      .then(
        () => setIsMsgSent(true),
        (error) => {
          console.error("Error sending email:", error);
          setIsMsgSent(true);
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <main className="container-x pt-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h1 className="text-5xl tracking-tight sm:text-6xl">Contact Us</h1>
          <ul className="mt-10 space-y-4">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl ring-1 ring-sand-200 transition group-hover:bg-ink group-hover:text-sun-300"><FiMail /></span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Email</span>
                  <span className="font-semibold">{CONTACT.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl ring-1 ring-sand-200 transition group-hover:bg-ink group-hover:text-sun-300"><FiPhone /></span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Phone</span>
                  <span className="font-semibold">{CONTACT.phone}</span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl ring-1 ring-sand-200"><FiMapPin /></span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Based in</span>
                <span className="font-semibold">Montego Bay, St. James</span>
              </span>
            </li>
          </ul>
          <SocialLinks className="mt-10" />
        </div>

        <div className="card p-6 sm:p-10">
          {!isMsgSent ? (
            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div>
                <label htmlFor="name" className="field-label">Full name</label>
                <input type="text" id="name" name="name" required autoComplete="name" className="field" />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <input type="email" id="email" name="email" required autoComplete="email" className="field" />
              </div>
              <div>
                <label htmlFor="message" className="field-label">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="6"
                  placeholder="Dates, where you're staying, how many of you, and what you'd like to see"
                  className="field resize-y"
                />
              </div>
              <button type="submit" disabled={isSending} className="btn-primary w-full !py-4">
                {isSending ? (<><FiLoader className="animate-spin" /> Sending…</>) : "Send message"}
              </button>
            </form>
          ) : (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-palm-500 text-2xl text-white">✓</span>
              <h2 className="mt-5 text-3xl">Message sent.</h2>
              <p className="mx-auto mt-3 max-w-sm text-ink-muted">
                Thanks for reaching out — we&apos;ll get back to you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
