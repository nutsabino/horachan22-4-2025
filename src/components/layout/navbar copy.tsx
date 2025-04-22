"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home,
  Package,
  MapPin,
  Lock,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useAuthContext } from "@/src/hooks/useAuth"; // นำเข้า useAuthContext
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const session = useAuthContext(); // ใช้ useAuthContext เพื่อเข้าถึงสถานะการเข้าสู่ระบบ
  const router = useRouter();

  // ฟังก์ชันสำหรับการออกจากระบบ
  const handleLogout = () => {
    // อัปเดตสถานะเป็น unauthorized และล้างข้อมูลผู้ใช้
    session.updateAuthStatus("unauthorized", undefined, null);
    // นำผู้ใช้กลับไปยังหน้าหลัก
    router.push("/");
    // ปิดเมนูมือถือถ้าเปิดอยู่
    setIsMobileMenuOpen(false);
  };

  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือไม่
  // const isLoggedIn = session.status === "authorized";
  const isLoggedIn = session.status === "authenticated";

  return (
    <nav className="sticky top-0 z-50 bg-black shadow-md">
      {/* ส่วนหัว navbar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* โลโก้ */}
        <Link href="/" className="flex items-center ml-4">
          <img src="/images/nav/logo.png" alt="Logo" className="h-12 w-auto" />
        </Link>

        {/* ส่วนขวาบนของมือถือ: ปุ่มเข้าสู่ระบบ/ออกจากระบบ + Hamburger */}
        <div className="flex items-center gap-3 md:hidden mr-4">
          {/* ปุ่มเข้าสู่ระบบ/ออกจากระบบ (เฉพาะมือถือ) */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-500 text-white px-4 py-1.5 rounded-full shadow hover:bg-red-600 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1 bg-white text-purple-700 px-4 py-1.5 rounded-full shadow hover:bg-gray-300 transition-all text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}

          {/* ปุ่มเมนู (Hamburger หรือ X) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* เมนูหลัก (เฉพาะ desktop) */}
        <div className="hidden md:flex items-center gap-x-4 mr-7">
          <ul className="flex space-x-10 text-gray-300 font-medium mr-13">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                หน้าแรก
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                แพ็คเกจท่องเที่ยว
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                เที่ยวไทยทั่วถึง
              </Link>
            </li>
          </ul>

          {/* ปุ่มเข้าสู่ระบบ/ออกจากระบบ (เฉพาะ desktop) */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* ชื่อผู้ใช้และอีเมล */}
              {session.user && (
                <div className="flex items-center text-white">
                  <User className="w-5 h-5 mr-2" />
                  <span>{session.user.username || session.user.email}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-full shadow hover:bg-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 bg-white text-purple-700 px-6 py-2 rounded-full shadow hover:bg-gray-300 transition-all"
            >
              <Lock className="w-5 h-5" />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>
      </div>

      {/* เมนูหลักในมือถือ (แสดงเมื่อเปิดเมนู) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute top-0 left-0 w-full bg-black/40 text-white px-6 pt-20 pb-6 animate-slide-down shadow-lg z-40">
            {/* ปุ่มปิดเมนู */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-6 text-white hover:text-gray-300 transition"
            >
              <X size={28} />
            </button>

            {/* ข้อมูลผู้ใช้ (ถ้าเข้าสู่ระบบแล้ว) */}
            {isLoggedIn && session.user && (
              <div className="mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-700 text-white p-3 rounded-full">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-lg">
                      {session.user.username || "ผู้ใช้"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* เมนู */}
            <ul className="flex flex-col space-y-10 font-medium text-lg">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Home size={20} />
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link
                  href="/src/app/cardsItems/packages.tsx"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Package size={20} />
                  แพ็คเกจท่องเที่ยว
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <MapPin size={20} />
                  เที่ยวไทยทั่วถึง
                </Link>
              </li>

              {/* ปุ่มออกจากระบบในเมนูมือถือ (แสดงเฉพาะเมื่อเข้าสู่ระบบแล้ว) */}
              {isLoggedIn && (
                <li className="pt-4 mt-4 border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut size={20} />
                    ออกจากระบบ
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
