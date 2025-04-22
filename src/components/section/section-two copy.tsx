'use client';

import React, { useState, useEffect } from 'react'
import SearchBar from '../component/searchbar';
import CardSet from '../component/package-card';
import { Button } from '@nextui-org/react'
import Link from 'next/link';
import { SearchType } from '../../../types/type';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function SectionTwo() {
    const [screenSize, setScreenSize] = useState('desktop');
    const [search] = useState<SearchType>({
        keyword: "",
        province: "",
        type: "normal",
        minprice: "",
        maxprice: "",
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setScreenSize('mobile');
            } else if (width >= 768 && width < 1366) {
                setScreenSize('laptop');
            } else {
                setScreenSize('desktop');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data } = useSWR(
        `/api/package?page=1&perPage=6&keyword=${search.keyword}&province=${search.province}&order=special`,
        fetcher
    );

    const deals = data ? data.items.slice(0, 6) : [];

    const getItemsPerSlide = () => {
        switch (screenSize) {
            case 'mobile': return 4;
            case 'laptop': return 4;
            default: return 6;
        }
    };

    const itemsPerSlide = getItemsPerSlide();

    return (
        <div className='min-h-screen relative bg-cover bg-center bg-no-repeat pt-12 sm:pt-14 md:pt-16 lg:pt-20 md:bg-[url("/images/2-section/bg.png")] bg-[url("/images/2-section/bg-mobile.png")]'>
            <div className="text-center py-4 md:py-6 lg:py-8">
                <img src="/images/2-section/head.png" alt="แพ็กเกจท่องเที่ยว" className="inline-block max-w-[80%] md:max-w-full" />
            </div>

            {search.type && <SearchBar />}

            <div className="max-w-5xl mx-auto px-2 py-4 flex relative">
                <div className="w-full">
                    <CardSet maxcard={6} deals={deals} />
                </div>
            </div>

            <div className="flex justify-center mt-2 md:mt-3 pb-4 md:pb-5">
                <Button
                    as={Link}
                    href={`/packages`}
                    className="w-[180px] md:w-[210px] lg:w-[250px] h-[40px] md:h-[45px] lg:h-[55px] px-4 py-2 bg-white text-[#490b9a] rounded-full hover:opacity-90 transition-opacity font-medium text-sm md:text-base lg:text-lg"
                    radius="sm"
                >
                    ดูแพ็กเกจเพิ่มเติม
                </Button>
            </div>
        </div>
    )
}

export default SectionTwo
