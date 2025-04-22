export interface SearchType {
    keyword: string;
    province: string;
    minprice: string;
    maxprice: string;
    type?: "normal" | "wow" | string;
}

export type AuthContextType = {
    user: User | undefined;
    status: "loading" | "authorized" | "unauthorized";
    token: string | null;
    updateAuthStatus: (newStatus: "loading" | "authorized" | "unauthorized", userData?: User, token?: string | null) => void;
};

export interface NationalityData {
    num_code: string;
    alpha_2_code: string;
    alpha_3_code: string;
    en_short_name: string;
    nationality: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    firstname: string;
    lastname: string;
    nationality: string;
    isComplete: boolean;
    isActive: boolean;
    providers: string;
}

export interface DealPriceLabel {
    price: string;
    discount: string;
    price_text: string;
    price_text_en: string | null;
}

export interface DealLabel {
    title_th: string;
    title_en: string;
    head_line_th: string;
    head_line_en: string;
}

export interface BrandLabel {
    title_th: string;
    title_en: string;
    excerpt_th: string;
    excerpt_en: string;
    province_th: string;
    province_en: string;
}

export interface DealItem {
    deal_id: number;
    deal_title: string;
    deal_label: DealLabel;
    deal_price_label: DealPriceLabel;
    deal_type: string;
    brand_id: number;
    brand_label: BrandLabel;
    brand_logo: string;
    brand_image: string;
    brand_keyword: string | null;
    brand_logo_webp: string;
    brand_image_webp: string;
}

export interface DealsApiResponse {
    code: number;
    msg: string;
    results: {
        found: number;
        per_page: string;
        page: number;
        items: DealItem[];
    };
}

export interface DealsResultResponse {
    found: number;
    per_page: string;
    page: number;
    items: DealItem[];
}

export interface DealDetailApiResponse {
    code: number;
    msg: string;
    results: DealDetailResult;
}

export interface DealDetailResult {
    brand_id: number;
    deal_id: number;
    deal_type: string;
    deal_label: DealLabel;
    deal_price_label: DealPriceLabel;
    deal_title_th: string;
    deal_title_en: string;
    deal_content_th: string;
    deal_content_en: string;
    deal_condition_th: string;
    deal_condition_en: string;
    deal_start: string;
    deal_end: string;
    online_start_date: string;
    online_end_date: string;
    price: number;
    discount: number;
    diff: number;
    coupon_access: string;
    coupon_type: string;
    coupon_qty: number;
    coupon_use: number;
    deal_options: DealOption[];
    file: string;
    out_link: string;
    status: string;
    brand: BrandDetail;
    brand_branch: any[];
}

export interface DealOption {
    deal_option_id: number;
    price: number;
    discount: number;
    fixed_main: number;
    price_text_th: string;
    price_text_en: string | null;
    details_th: string;
    details_en: string;
}

export interface BrandDetail {
    brand_id: number;
    campaign_id: number;
    brand_title_th: string;
    brand_title_en: string;
    brand_excerpt_th: string;
    brand_excerpt_en: string;
    brand_content_th: string;
    brand_content_en: string;
    brand_label: BrandLabel;
    province: number;
    province_th: string;
    province_en: string;
    address_th: string;
    address_en: string | null;
    zipcode: string | null;
    tel: string;
    fax: string | null;
    email: string;
    facebook: string | null;
    facebook_link: string | null;
    website: string;
    website_link: string;
    line: string | null;
    line_link: string | null;
    ig: string | null;
    ig_link: string | null;
    lat: string;
    lon: string;
    youtube: string | null;
    youtube_link: string | null;
    twitter: string | null;
    twitter_link: string | null;
    whatsapp: string | null;
    whatsapp_link: string | null;
    tiktok: string | null;
    tiktok_link: string | null;
    brand_logos: BrandImages;
    brand_images: BrandImages;
    brand_logo: string;
    brand_image: string;
    gallery: GalleryItem[];
    deals: BrandDeal[];
}

export interface BrandImages {
    s: string;
    m: string;
    hd: string;
    fhd: string;
}

export interface GalleryItem {
    id: string;
    url: string;
    urls: BrandImages;
}

export interface BrandDeal {
    ID: number;
    deal_author: number;
    brand_id: number;
    deal_type: string;
    deal_label: string; // This is a JSON string in the original data
    deal_price_label: string; // This is a JSON string in the original data
    deal_title: string;
    deal_excerpt: string;
    deal_content: string;
    deal_search: string;
    deal_image: string;
    deal_date: string;
    deal_keyword: string;
    deal_start: string;
    deal_end: string;
    online_start_date: string;
    online_end_date: string;
    price: number;
    discount: number;
    diff: number;
    coupon_limit_per_day: string;
    coupon_access: string;
    coupon_type: string;
    coupon_qty: number;
    coupon_use: number;
    insertDate: string;
    insertIp: string;
    updateDate: string;
    updateIp: string;
    sort_by: number;
    status: string;
    tranfer_deal_id: number;
    tranfer_v: number;
    deal_title_en: string;
    deal_excerpt_en: string;
    deal_content_en: string;
    head_line: string;
    head_line_en: string;
    deal_condition: string;
    deal_condition_en: string;
    coupon_exp_date: string;
    coupon_fixed: string;
    coupon_char: string;
    coupon_duration: string;
    coupon_limit_use: string;
    wkt_label: string;
    file: string;
    out_link: string;
    deal_options: BrandDealOption[];
    types: any[]; // Assuming this is always an empty array based on the provided data
    cache: string;
}

export interface BrandDealOption {
    ID: number;
    deal_id: number;
    price: number;
    discount: number;
    fixed_main: number;
    price_text: string;
    price_text_en: string | null;
    details: string;
    details_en: string | null;
    insertDate: string;
    insertIp: string;
    updateDate: string;
    updateIp: string;
    sort_by: number;
    status: string;
    tranfer_dealoption_id: string | null;
    tranfer_v: string | null;
}

export type MustDoDataAttributes = {
    category: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    detail: string;
    cover: {
        data: CoverImage
    };
    gallery: {
        data: CoverImage[]
    }
    province: string;
    address: string;
    tel: string;
    email: string;
    website: string;
    google_map: string;
};

export type MustDoDataItem = {
    id: number;
    attributes: MustDoDataAttributes;
};

export type Pagination = {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
};

export type ApiResponse = {
    data: MustDoDataItem[];
    meta: {
        pagination: Pagination;
    };
};

export type CoverImageFormat = {
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
};

export type CoverImage = {
    id: number;
    attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: {
            small: CoverImageFormat;
            medium?: CoverImageFormat;
            large?: CoverImageFormat;
            thumbnail: CoverImageFormat;
        };
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        provider_metadata: string | null;
        createdAt: string;
        updatedAt: string;
    };
};
