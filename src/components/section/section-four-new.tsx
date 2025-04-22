"use client";

import React from "react";
import TourismCard from "../component/tourism-card";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function SectionFourNew() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/travel");
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-top bg-no-repeat pt-10 md:pt-16 lg:pt-20 pb-8 md:pb-12"
      style={{ backgroundImage: 'url("/images/4-section/bg.png")' }}
    >
      <div className="text-center">
        <img
          src="/images/4-section/head.png"
          alt="แพ็กเกจท่องเที่ยว"
          className="inline-block w-auto h-auto max-w-[80%] md:max-w-[70%] lg:max-w-[60%]"
        />
      </div>

      <div className="container mx-auto px-4 py-4 pt-6 md:pt-8 lg:pt-10">
        <div className="tourism-card-container">
          <TourismCard limit={4} />
        </div>
      </div>

      <div className="flex justify-center mt-1 md:mt-2 mb-6">
        <Button
          onPress={handlePress}
          className="w-[150px] md:w-[180px] lg:w-[220px] h-[40px] md:h-[45px] lg:h-[50px] px-4 py-2 bg-white text-[#490b9a] rounded-full hover:opacity-90 transition-opacity font-medium text-sm md:text-base lg:text-lg"
        >
          ดูเพิ่มเติม
        </Button>
      </div>

      <style jsx>{`
        @media (min-width: 768px) and (max-width: 1280px) {
          :global(.tourism-card-container) {
            display: block;
            width: 100%;
          }

          :global(.tourism-card-container > div) {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 16px;
          }

          :global(body) {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
}

export default SectionFourNew;
