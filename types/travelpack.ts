export interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

export interface ImageFormats {
    small: ImageFormat;
    thumbnail: ImageFormat;
}

export interface CoverImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: ImageFormats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface TourPackage {
    id: number;
    documentId: string;
    name: string;
    detail: string | null;
    cover_image: {
        id: number;
        url: string;
        formats: {
            small: { url: string };
            medium: { url: string };
            large: { url: string };
            thumbnail: { url: string };
        };
    } | null;
}

export interface ApiResponse {
    data: TourPackage[];
    meta: any;
}

export interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

export interface ImageFormats {
    small: ImageFormat;
    thumbnail: ImageFormat;
}

export interface Image {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: ImageFormats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface TravelPackage {
    data: {
        id: number;
        documentId: string;
        name: string;
        detail: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        editorial: string;
        fb_link: string | null;
        ig_link: string | null;
        line_link: string | null;
        youtube_link: string | null;
        tiktok_link: string | null;
        cover_image: Image;
        images: Image[];
    };
    meta: any;
}