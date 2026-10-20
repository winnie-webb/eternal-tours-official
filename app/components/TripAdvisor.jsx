/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { CONTACT } from "./SocialLinks";

// Tripadvisor's own widgets: the Travelers' Choice badge and the live rating.
export const TripAdvisor = () => {
  return (
    <section className="container-x">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-sand-200 bg-white px-6 py-6 sm:flex-row sm:justify-between sm:px-10">
        <div className="flex items-center gap-5">
          <TripAdvisorCertificate />
          <div>
            <p className="eyebrow">Tripadvisor Travelers&apos; Choice</p>
            <p className="mt-1 font-display text-2xl leading-tight">
              Rated by the guests we&apos;ve driven.
            </p>
          </div>
        </div>
        <TripAdvisorWidget />
      </div>
    </section>
  );
};

const TripAdvisorWidget = () => {
  useEffect(() => {
    const container = document.getElementById("TA-widget-container");
    if (!container || container.querySelector("script")) return;
    const script = document.createElement("script");
    script.src =
      "https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=889&locationId=23245962&lang=en_US&border=true&display_version=2";
    script.async = true;
    container.appendChild(script);
  }, []);

  return (
    <div id="TA-widget-container" className="min-h-[60px]">
      <div id="TA_cdsratingsonlynarrow889" className="TA_cdsratingsonlynarrow">
        <ul id="8vQX198f" className="TA_links W7qd0aL">
          <li id="mGcSYpQTiE" className="2CKr4Zn31w4">
            <a target="_blank" rel="noopener noreferrer" href={CONTACT.tripadvisor}>
              <img
                src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg"
                alt="Tripadvisor"
                className="h-8"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const TripAdvisorCertificate = () => {
  useEffect(() => {
    const container = document.getElementById("TA_certificateOfExcellence1");
    if (!container || container.querySelector("script")) return;
    const script = document.createElement("script");
    script.src =
      "https://www.jscache.com/wejs?wtype=certificateOfExcellence&uniq=1&locationId=23245962&lang=en_US&year=2024&display_version=2";
    script.async = true;
    container.appendChild(script);
  }, []);

  return (
    <div id="TA_certificateOfExcellence1" className="TA_certificateOfExcellence shrink-0">
      <ul id="3cJTo0CxwrNQ" className="TA_links zDyOooRs35">
        <li id="Iae2IdI9fUn6" className="C8LKhmA">
          <a target="_blank" rel="noopener noreferrer" href={CONTACT.tripadvisor}>
            <img
              src="https://static.tacdn.com/img2/travelers_choice/widgets/tchotel_2024_L.png"
              alt="Tripadvisor Travelers' Choice 2024"
              className="widCOEImg h-20 w-auto"
              id="CDSWIDCOELOGO"
            />
          </a>
        </li>
      </ul>
    </div>
  );
};
