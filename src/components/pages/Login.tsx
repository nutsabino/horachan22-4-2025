"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/src/hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const LogInSchema = z.object({
  identifier: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  staySignedIn: z.boolean(),
});

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const session = useAuthContext();

  // รับข้อผิดพลาดจาก URL ถ้ามี
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "oauth_error") {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google โปรดลองอีกครั้ง");
    } else if (urlError === "email_exists") {
      const email = searchParams.get("email");
      setError(`อีเมล ${email} มีอยู่ในระบบแล้ว โปรดเข้าสู่ระบบด้วยรหัสผ่าน`);
    } else if (urlError === "unexpected_error") {
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้งในภายหลัง");
    }
  }, [searchParams]);
  console.log(setError);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      identifier: "",
      password: "",
      staySignedIn: false,
    },
  });

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status, router]);

  const onSubmit = async (values: z.infer<typeof LogInSchema>) => {
    try {
      setError(null);
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
      const response = await axios.post(`${backendUrl}/api/auth/local`, {
        identifier: values.identifier,
        password: values.password,
      });

      if (response.status === 200) {
        const userData = response.data.user;
        const jwt = response.data.jwt;

        session.updateAuthStatus("authenticated", userData, jwt);
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setError("รหัสผ่านไม่ถูกต้องหรือไม่พบบัญชีผู้ใช้");
        } else {
          setError("เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบอีเมลและรหัสผ่านของคุณ");
        }
      } else {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดลองใหม่ภายหลัง");
      }

      session.updateAuthStatus("unauthorized", undefined, null);
    }
  };

  const handleSocialLogin = (provider: string) => {
    const path = `/api/connect/${provider}?prompt=select_account`;
    const url = new URL("http://localhost:1337" + path);

    window.location.href = url.href;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative pt-20"
      style={{ backgroundImage: "url(/images/other/bg5.png)" }}
    >
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              อีเมล
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="identifier"
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                )}
              />
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.identifier.message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="password"
                    type="password"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                )}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Link & Submit */}
          <div className="flex items-center justify-between">
            <a
              href="/forgotpass"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ลืมรหัสผ่าน?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
          >
            เข้าสู่ระบบ
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือ</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-gray-700">เข้าสู่ระบบด้วย Google</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <a href="." className="text-blue-600 hover:text-blue-800">
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
