import React, { Dispatch, SetStateAction } from "react";
import { DealItem, SearchType, User } from "./type";

export interface DataDetailProps {
    id: string;
}

export interface DealDetailProps {
    id: string;
}

export interface CarouselSetProps {
    category: number;
}

export interface CardSetProps {
    maxcard: number;
    deals: DealItem[];
}

export interface DataSetProps {
    maxcard: number;
}

export interface SearchBoxProps {
    search?: SearchType;
    setSearch?: Dispatch<SetStateAction<SearchType>>;
}

export interface LayoutProps {
    children: React.ReactNode
}

export interface ErrorStateProps {
    message?: string;
}
export interface UserAccountProps {
    user: User;
}