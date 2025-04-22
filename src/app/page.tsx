"use client";

import React from "react";
import CardsItems from "./cardsItems/cardsItems";
import SectionOne from "../components/section/section-one";
// import SectionTwo from "../components/section/section-two";
// import SectionThree from '../components/section/section-three';
import SectionFourNew from "../components/section/section-four-new";



function HomePage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-hidden">
      {/* <section id="home" className="w-full">
        <SectionOne />
      </section> */}
      {/* <section id="packages" className="w-full">
        <SectionTwo />
      </section> */}
      

      <section id="packages" className="w-full">
        <CardsItems />
      </section>

      {/* <section id="tourism" className="w-full">
        <SectionThree />
      </section> */}

      {/* <section id="travel" className="w-full">
        <SectionFourNew />
      </section> */}
    </div>
  );
}

export default HomePage;
