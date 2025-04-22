export interface CouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    deal: DealCoupon;
    contact: DealContact;
    coupontitle: string;
    coupondetail: string;
}

export interface CouponData {
    coupon_code: string;
    promotion: string;
    deal_date: string;
    time_exp_date: string;
}
export interface DealCoupon {
    dealId: string | number;
    dealOptionId: string | number;
    expire: string;
    outlink: string;
    brandTitle: string;
    condition: string;
}

export interface DealContact {
    address: string;
    tel: string;
    email: string;
    website: string;
}

export interface CouponRequestBody {
    deal: DealCoupon;
    contact: DealContact;
    coupondetail: string;
}