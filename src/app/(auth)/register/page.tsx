"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { AlertCircle, Check, Lock, Mail, User } from 'lucide-react';
import { FormData, FormErrors } from '../../../../types/user';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { Button, Image } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { Controller, useForm } from 'react-hook-form';

const initialFormData: FormData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    privacyPolicy: false,
    newsletter: false,
    providers: 'local'
};

const FORM_STORAGE_KEY = 'registrationFormData';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const {
        control,
        setValue,
    } = useForm<FormData>({
        defaultValues: initialFormData
    });
    const [submitError, setSubmitError] = useState<string>('');
    const router = useRouter();
    const [captchaToken, setCaptchaToken] = useState<string>("");
    const [captchaError, setCaptchaError] = useState<string | null>(null);
    const [privacyPolicyRead, setPrivacyPolicyRead] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const isPolicyRead = localStorage.getItem("privacyPolicyRead") === "true";
            setPrivacyPolicyRead(isPolicyRead);
        };

        const handleMessage = (event: MessageEvent) => {
            if (event.data === "privacyPolicyRead") {
                localStorage.setItem("privacyPolicyRead", "true");
                setPrivacyPolicyRead(true);
                const savedFormData = localStorage.getItem('registrationFormData');
                if (savedFormData) {
                    setFormData(JSON.parse(savedFormData));
                    localStorage.removeItem('registrationFormData');
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("message", handleMessage);

        handleStorageChange();

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstname) {
            newErrors.firstname = 'กรุณากรอกชื่อ';
        }

        if (!formData.lastname) {
            newErrors.lastname = 'กรุณากรอกนามสกุล';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'กรุณากรอกอีเมล';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        }

        if (!formData.password) {
            newErrors.password = 'กรุณากรอกรหัสผ่าน';
        } else if (formData.password.length < 8) {
            newErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
        }

        if (!formData.privacyPolicy && privacyPolicyRead) {
            newErrors.privacyPolicy = 'กรุณายอมรับนโยบายความเป็นส่วนตัว';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name: string, value: boolean): void => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        setSubmitError('');

        if (!validateForm()) {
            return;
        }

        if (!captchaToken) {
            setCaptchaError("Please complete the hCaptcha verification");
            return;
        }
        setCaptchaError(null);

        try {
            const formDataToSend = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                privacyPolicy: formData.privacyPolicy,
                newsletter: formData.newsletter,
                providers: 'local'
            };

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend)
            });

            const data = await response.json();

            if (!response.ok) {
                setSubmitError(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
                return;
            }

            if (!data.jwt) {
                console.error('No JWT in response:', data);
                setSubmitError('เกิดข้อผิดพลาดในการลงทะเบียน: ไม่พบ token');
                return;
            }

            setCookie('token', data.jwt, {
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            await Swal.fire({
                icon: 'success',
                title: 'ลงทะเบียนสำเร็จ',
                text: 'กำลังพาคุณไปยังหน้าหลัก...',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    popup: 'rounded-3xl',
                    title: 'text-2xl font-bold',
                    htmlContainer: 'text-gray-600'
                }
            });
            router.push('/');

        } catch (error) {
            console.error('Error:', error);
            setSubmitError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        }
    };

    const handlePrivacyPolicyClick = () => {
        sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
        localStorage.removeItem("privacyPolicyRead");
        setPrivacyPolicyRead(false);
        router.push("/privacy");
    };

    useEffect(() => {
        const storedFormData = sessionStorage.getItem(FORM_STORAGE_KEY);
        if (storedFormData) {
            try {
                const parsedData = JSON.parse(storedFormData);
                setFormData(parsedData);
                sessionStorage.removeItem(FORM_STORAGE_KEY);
            } catch (error) {
                console.error('Error parsing stored form data:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (!document.referrer.includes('/privacy')) {
            sessionStorage.removeItem(FORM_STORAGE_KEY);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative pt-20"
            style={{ backgroundImage: 'url(/images/other/bg5.png)' }}>
            <div className="absolute inset-0 backdrop-blur-sm"></div>

            <div className="flex lg:flex-row bg-white lg:w-full w-[90%] max-w-5xl mx-auto rounded-3xl relative z-10">
                <div className="hidden lg:block w-[40%]">
                    <Image
                        src="/images/other/register2.jpg"
                        radius="none"
                        className="h-full object-cover rounded-tl-3xl rounded-bl-3xl"
                        removeWrapper
                    />
                </div>

                <form onSubmit={handleSubmit} className="md:p-8 px-2 py-8 lg:w-[55%] w-[90%] justify-center flex flex-col gap-4 mx-auto">
                    <h2 className="text-4xl font-bold mb-4">สมัครสมาชิก</h2>

                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>{submitError}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <div className='relative flex items-center'>
                                <User className="absolute left-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="กรุณากรอกชื่อของคุณ"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 border rounded-lg ${errors.firstname ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.firstname && (
                                <p className="text-red-600 text-sm mt-1">{errors.firstname}</p>
                            )}
                        </div>

                        <div className="relative">
                            <div className='relative flex items-center'>
                                <User className="absolute left-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    placeholder="กรุณากรอกนามสกุลของคุณ"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 border rounded-lg ${errors.lastname ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.lastname && (
                                <p className="text-red-600 text-sm mt-1">{errors.lastname}</p>
                            )}
                        </div>

                        <div className="relative">
                            <div className='relative flex items-center'>
                                <Mail className="absolute left-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className='relative'>
                            <div className='relative flex items-center'>
                                <Lock className="absolute left-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-3 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="ยืนยันรหัสผ่าน"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full pl-10 p-3 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {!privacyPolicyRead && (
                        <Button
                            onClick={handlePrivacyPolicyClick}
                            className="mb-2 text-blue-600 underline"
                        >
                            อ่านนโยบายความเป็นส่วนตัว
                        </Button>
                    )}

                   
                    {errors.privacyPolicy && (
                        <p className="text-red-600 text-sm">{errors.privacyPolicy}</p>
                    )}

                    

                   
                    {captchaError && <p className="text-red-600">{captchaError}</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#490b9a] text-white font-normal p-3 rounded-lg hover:bg-[#5f25aa] transition-colors mt-2"
                    >
                        ยืนยัน
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-2">
                        มีบัญชีอยู่แล้ว?{' '}
                        <a href="/login" className="text-[#490b9a] hover:text-[#24113d]">
                            เข้าสู่ระบบ
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;