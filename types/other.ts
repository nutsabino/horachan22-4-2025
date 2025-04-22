interface SearchBarProps {
    onSearch: (searchParams: SearchParams) => void;
}

interface SearchParams {
    keyword: string;
    location: string;
    minPrice: string;
    maxPrice: string;
}