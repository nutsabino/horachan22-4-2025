"use client";

import React, { FC } from "react";
import { Image } from "@nextui-org/react";
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { CardSetProps } from "../../../types/props";
import { DealItem } from "../../../types/type";

const CardSet: FC<CardSetProps> = ({ maxcard, deals }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {deals.slice(0, maxcard).map((deal: DealItem, index: number) => (
                <Link
                    key={deal.deal_id}
                    href={`/packages/${deal.deal_id}`}
                    className="block transition-transform hover:scale-105"
                >
                    <Card className="overflow-hidden h-full cursor-pointer rounded-none border-0 flex flex-col">
                        <div className="relative w-full aspect-video flex-shrink-0">
                            <Image
                                src={deal.brand_image_webp}
                                alt={`cardimage${index}`}
                                className="object-cover w-full h-full"
                                radius="none"
                            />
                            <div className="absolute z-10 top-0 left-0 w-14 h-14 md:w-20 md:h-20 bg-blue-300 rounded-br-full shadow-lg flex items-center justify-center">
                                <Image
                                    src={deal.brand_logo_webp}
                                    alt={deal.deal_title}
                                    className="z-20 w-8 h-8 md:w-12 md:h-12 mb-2 mr-2 md:mb-4 md:mr-4"
                                    removeWrapper
                                    radius="none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col flex-grow">
                            <CardHeader className="flex-shrink-0">
                                <CardTitle className="text-sm md:text-lg text-center line-clamp-2">
                                    {deal.deal_label.head_line_th}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-shrink-0">
                                <p className="text-xs md:text-sm text-gray-500 text-center line-clamp-2">
                                    {deal.deal_label.title_th}
                                </p>
                            </CardContent>
                            <CardFooter className="bg-[#e50087] text-primary-foreground flex justify-between items-center py-3 mt-auto">
                                <p className="font-bold text-xs sm:text-sm md:text-base lg:text-xl">{deal?.deal_price_label?.price_text ?? "Free"}</p>
                                <p className="font-medium text-[8px] sm:text-xs md:text-sm underline">ดูรายละเอียด {'>>'}</p>
                            </CardFooter>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

export default CardSet