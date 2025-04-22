import React, { useState, useEffect } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { ExternalLink, Mail, RefreshCw, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { CouponData, CouponModalProps } from "../../../types/coupon";
import Swal from "sweetalert2";

const CouponModal: React.FC<CouponModalProps> = ({
    isOpen,
    onClose,
    deal,
    contact,
    coupontitle,
    coupondetail,
}) => {
    const [couponData, setCouponData] = useState<CouponData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [countdownActive, setCountdownActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const getCookie = (name: string): string | null => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) {
                    const partValue = parts.pop();
                    if (partValue) {
                        return partValue.split(';').shift() || null;
                    }
                }
                return null;
            };

            const token = getCookie('token');
            setIsLoggedIn(!!token);
        }
    }, [isOpen]);

    useEffect(() => {
        const getCoupon = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const requestBody = {
                    deal,
                    ...(deal.outlink && {
                        contact: contact,
                        coupondetail: coupondetail,
                    }),
                };

                const response = await axios.post("/api/coupon", requestBody);
                if (response.data.code === 1) {
                    setCouponData(response.data.msg.results);
                    setEmailSent(false);
                    setTimeLeft(15 * 60);
                    setCountdownActive(true);
                } else if (response.data.code === 2) {
                    setCouponData(response.data.msg.results);
                    setEmailSent(true);
                    setCouponData(null);
                } else {
                    setError(
                        response.data.msg || "An error occurred while fetching the coupon."
                    );
                }
            } catch (error) {
                console.error("Error fetching coupon:", error);
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 401 && error.response.data.msg === "กรุณาเข้าสู่ระบบ") {
                        setIsLoggedIn(false);
                        setError("กรุณาเข้าสู่ระบบ");
                        setIsLoading(false);
                        return;
                    }

                    if (deal.outlink && error.response.data.msg !== "กรุณาเข้าสู่ระบบ") {
                        setIsLoading(false);
                        return;
                    } else if (
                        error.response.data.msg === "Coupon over limit per user"
                    ) {
                        setEmailSent(true);
                        setCouponData(null);
                        return;
                    }
                    setError(
                        error.response.data.msg ||
                        "Failed to fetch coupon. Please try again."
                    );
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            getCoupon();
        } else {
            setCountdownActive(false);
            setTimeLeft(15 * 60);
        }
    }, [isOpen, deal, contact, coupondetail]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdownActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setCountdownActive(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && couponData) {
            setCouponData(null);
            setError("คูปองหมดอายุแล้ว โปรดกดรับคูปองใหม่");
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [countdownActive, timeLeft, couponData]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        setError(null);
        try {
            const requestBody = {
                deal,
                contact,
                coupondetail,
                couponData
            };

            const response = await axios.post("/api/resend", requestBody);
            if (response.status === 200) {
                setEmailSent(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Email Resent!',
                    text: 'The coupon have been resent to your email.',
                    confirmButtonColor: '#71161d',
                });
            } else {
                setError("Failed to resend email. Please try again.");
            }
        } catch (error) {
            console.error("Error resending email:", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401 && error.response.data.msg === "กรุณาเข้าสู่ระบบ") {
                    setIsLoggedIn(false);
                    setError("กรุณาเข้าสู่ระบบ");
                    setIsResending(false);
                    return;
                }

                setError(
                    error.response.data.error || "Failed to resend email. Please try again."
                );
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsResending(false);
        }
    };

    const handleOutlinkClick = () => {
        if (deal.outlink) {
            window.open(deal.outlink, "_blank", "noopener,noreferrer");
        }
    };

    if (!isOpen) return null;

    if (!isLoggedIn) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs sm:max-w-sm text-center">
                    <div className="py-6">
                        <h3 className="text-xl font-bold text-red-600 mb-8">กรุณาเข้าสู่ระบบ</h3>
                        <Button
                            color="primary"
                            onClick={onClose}
                            className="px-5 py-4"
                        >
                            ปิด
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-16 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl my-8">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 break-words">
                    {deal.brandTitle}
                </h2>
                <h3 className="text-lg font-semibold text-center mb-2 text-gray-600">
                    รายละเอียดคูปอง
                </h3>
                <h4 className="text-md font-semibold text-center mb-2 text-gray-600 break-words">
                    {coupontitle}
                </h4>
                <div
                    className="text-sm text-center mb-4 text-gray-600 break-words"
                    dangerouslySetInnerHTML={{ __html: coupondetail }}
                />
                <div className="text-center mb-4">
                    <p className="text-sm text-red-600 font-semibold">
                        หมดอายุ : {deal.expire}
                    </p>

                    {couponData && countdownActive && (
                        <div className="flex items-center justify-center bg-yellow-50 px-3 py-1 rounded-full mt-2 mx-auto w-max">
                            <Clock className="w-4 h-4 text-red-500 mr-1" />
                            <span className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-red-500'}`}>
                                รหัสโค้ดนี้มีเวลาใช้งาน : {formatTime(timeLeft)}
                            </span>
                        </div>
                    )}
                </div>

                {error ? (
                    <div className="text-red-500 text-center mb-4">
                        <p>{error}</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                ) : emailSent ? (
                    <div className="space-y-4 mb-6">
                        <Alert className="bg-green-50 border-green-200">
                            <Mail className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800">
                                Email Sent Successfully!
                            </AlertTitle>
                            <AlertDescription className="text-green-700">
                                Your deal have been sent to your email address. Please check
                                your inbox for the complete information.
                            </AlertDescription>
                        </Alert>
                        <div className="text-sm text-red-600 text-center">
                            <p>*Sometimes it may take 3-10 minutes for the email to arrive.</p>
                            <p>Please check your spam or junk folder.</p>
                            <p>Didn&apos;t receive the email?</p>
                            <Button
                                color="success"
                                onClick={handleResendEmail}
                                disabled={isResending}
                                className="mt-2 px-4 py-2 flex items-center gap-2 mx-auto bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isResending ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                                <span>Resend Email</span>
                            </Button>
                        </div>
                    </div>
                ) : deal.outlink ? (
                    <div className="flex flex-col items-center space-y-2 mb-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center w-full sm:w-auto">
                            <Button
                                color="primary"
                                onClick={handleOutlinkClick}
                                className="w-full sm:w-auto min-w-[200px] px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-1 sm:gap-2"
                                size="lg"
                            >
                                <span className="text-sm sm:text-base md:text-lg whitespace-nowrap">
                                    Visit Website to Get Deal
                                </span>
                                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>
                    </div>
                ) : couponData ? (
                    <>
                        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
                            <h4 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-2 break-all">
                                {couponData.coupon_code}
                            </h4>
                        </div>
                        <div className="mt-4 text-center">
                            <h5 className="text-lg font-semibold mt-4 mb-2">เงื่อนไข</h5>
                            <div className="text-sm sm:text-base space-y-2 overflow-y-auto max-h-32 sm:max-h-40 lg:max-h-48 bg-gray-50 p-3 rounded-lg">
                                <div
                                    className="prose prose-sm sm:prose max-w-none break-words"
                                    dangerouslySetInnerHTML={{ __html: deal.condition }}
                                />
                            </div>
                        </div>
                    </>
                ) : null}

                <div className="mt-6 flex justify-center">
                    <Button
                        color="primary"
                        onClick={onClose}
                        className="px-4 sm:px-6 py-2 text-sm sm:text-base"
                    >
                        ปิด
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CouponModal;