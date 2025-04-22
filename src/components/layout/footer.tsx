'use client'

import { Link } from '@nextui-org/react';

export default function Footer() {
    return (
        <div className="w-full py-12 flex flex-col relative z-10 mb-8">
            <div
                className="absolute inset-0 hidden md:block bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url('/images/nav/footer-desktop.png')`
                }}
            />

            <div className="absolute inset-0 block md:hidden bg-[#1a0044] z-0" />

            <div className="relative z-10">
                <div className="grid p-10 md:flex md:flex-row justify-center items-center gap-4 md:gap-7 my-2">
                    <img
                        alt="mobile logo"
                        src="/images/nav/text-footer-mb.png"
                        className="block md:hidden justify-center items-center"
                    />
                </div>

                <div className="flex md:hidden flex-row gap-2 text-sm justify-center my-4 mx-1">
                    <Link
                        href="/cookie"
                        className="text-white hover:text-gray-300 transition-colors"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        Cookie Policy
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-white hover:text-gray-300 transition-colors"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        Privacy Policy
                    </Link>
                </div>

                <div className="hidden md:flex flex-row gap-4 text-md justify-center mt-12">
                    <Link
                        href="/cookie"
                        className="text-white hover:text-gray-300 transition-colors"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        Cookie Policy
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-white hover:text-gray-300 transition-colors"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
}