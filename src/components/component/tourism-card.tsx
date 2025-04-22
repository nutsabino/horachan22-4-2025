import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { LoadingState, ErrorState } from "../ui/state";
import { TourPackage, ApiResponse } from '../../../types/travelpack';

interface TourismCardProps {
    limit?: number;
}

const TourismCard: React.FC<TourismCardProps> = ({ limit }) => {
    const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTourPackages = async () => {
            try {
                const response = await fetch('/api/travel');
                if (!response.ok) {
                    throw new Error('Failed to fetch tour packages');
                }
                const responseData: ApiResponse = await response.json();
                const tourData = responseData.data || [];
                setTourPackages(tourData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                console.error('Error fetching tour packages:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTourPackages();
    }, []);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState />;

    const displayPackages = limit ? tourPackages.slice(0, limit) : tourPackages;

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                {displayPackages.map((pack) => (
                    <Link
                        key={pack.documentId}
                        href={`/travel/${pack.documentId}`}
                        className="block transition-transform hover:scale-105"
                    >
                        <Card className="overflow-hidden h-64 sm:h-72 md:h-full cursor-pointer rounded-none border-0 flex flex-col">
                            <div className="relative w-full aspect-video md:h-60 flex-shrink-0">
                                <Image
                                    src={pack.cover_image?.url || "/api/placeholder/800/600"}
                                    alt={pack.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <CardHeader className="flex-shrink-0 p-2 md:p-6">
                                    <CardTitle className="text-sm md:text-lg text-center line-clamp-2">
                                        {pack.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-shrink-0 p-2 md:p-6">
                                    <p className="text-xs md:text-sm text-gray-500 text-center line-clamp-2">
                                        {pack.detail || ""}
                                    </p>
                                </CardContent>
                                <CardFooter className="bg-primary text-primary-foreground flex justify-center items-center py-3 mt-auto">
                                    <p className="font-medium text-[10px] sm:text-xs md:text-sm underline">ดูรายละเอียด {'>>'}</p>
                                </CardFooter>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TourismCard;