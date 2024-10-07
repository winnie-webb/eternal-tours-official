/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef } from "react";

export const TripAdvisor = () => {
  return (
    <div className="flex items-center justify-between">
      <TripAdvisorCertificate></TripAdvisorCertificate>
      <TripAdvisorWidget></TripAdvisorWidget>
    </div>
  );
};
const TripAdvisorWidget = () => {
  useEffect(() => {
    // Dynamically add the TripAdvisor script
    const script = document.createElement("script");
    script.src =
      "https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=889&locationId=23245962&lang=en_US&border=true&display_version=2";
    script.async = true;
    script.onload = () => {
      console.log("TripAdvisor widget loaded.");
    };

    document.getElementById("TA-widget-container").appendChild(script);
  }, []);

  return (
    <div className="w-full flex-1">
      <div id="TA-widget-container">
        <div
          id="TA_cdsratingsonlynarrow889"
          className="TA_cdsratingsonlynarrow"
        >
          <ul id="8vQX198f" className="TA_links W7qd0aL">
            <li id="mGcSYpQTiE" className="2CKr4Zn31w4">
              <a
                target="_blank"
                href="https://www.tripadvisor.com/Attraction_Review-g147311-d23245962-Reviews-Jamaica_Eternal_Tours_And_Transportation-Montego_Bay_Saint_James_Parish_Jamaica.html"
              >
                <img
                  src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg"
                  alt="TripAdvisor"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
const TripAdvisorCertificate = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.jscache.com/wejs?wtype=certificateOfExcellence&uniq=1&locationId=23245962&lang=en_US&year=2024&display_version=2";
    script.async = true;
    script.onload = () => {
      script.loadtrk = true;
    };

    document.getElementById("TA_certificateOfExcellence1").appendChild(script);
  }, []);

  return (
    <div className="flex-1">
      <div
        id="TA_certificateOfExcellence1"
        className="TA_certificateOfExcellence"
      >
        <ul id="3cJTo0CxwrNQ" className="TA_links zDyOooRs35">
          <li id="Iae2IdI9fUn6" className="C8LKhmA">
            <a
              target="_blank"
              href="https://www.tripadvisor.com/Attraction_Review-g147311-d23245962-Reviews-Jamaica_Eternal_Tours_And_Transportation-Montego_Bay_Saint_James_Parish_Jamaica.html"
            >
              <img
                src="https://static.tacdn.com/img2/travelers_choice/widgets/tchotel_2024_L.png"
                alt="TripAdvisor"
                className="widCOEImg"
                id="CDSWIDCOELOGO"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
