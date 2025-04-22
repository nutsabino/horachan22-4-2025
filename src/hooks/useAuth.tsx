"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// ประเภทของสถานะการยืนยันตัวตน
type AuthStatus = "loading" | "authenticated" | "unauthorized";

// โครงสร้างข้อมูลผู้ใช้
interface User {
  id: number;
  username: string;
  email: string;
  [key: string]: any;
}

// ประเภทข้อมูล context
interface AuthContextType {
  status: AuthStatus;
  user: User | undefined;
  token: string | null;
  updateAuthStatus: (
    status: AuthStatus,
    user?: User,
    token?: string | null
  ) => void;
  logout: () => void;
}

// สร้าง context เริ่มต้น
const AuthContext = createContext<AuthContextType>({
  status: "loading",
  user: undefined,
  token: null,
  updateAuthStatus: () => {},
  logout: () => {},
});

// ตัวห่อ context provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // โหลดข้อมูลจาก cookies เมื่อ component ถูก mount
  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUsername = Cookies.get("username");
    const storedUserId = Cookies.get("userId");

    if (storedToken && storedUsername && storedUserId) {
      setStatus("authenticated");
      setToken(storedToken);
      setUser({
        id: parseInt(storedUserId),
        username: storedUsername,
        email: "", // คุณสามารถเพิ่ม email ลง cookie ได้ถ้าต้องการ
      });
    } else {
      setStatus("unauthorized");
      setToken(null);
      setUser(undefined);
    }
  }, []);

  // ฟังก์ชันอัปเดตสถานะการยืนยันตัวตน
  const updateAuthStatus = (
    newStatus: AuthStatus,
    newUser?: User,
    newToken?: string | null
  ) => {
    setStatus(newStatus);
    setUser(newUser);
    setToken(newToken || null);

    if (newStatus === "authenticated" && newToken && newUser) {
      Cookies.set("token", newToken, { expires: 7 });
      Cookies.set("username", newUser.username, { expires: 7 });
      Cookies.set("userId", String(newUser.id), { expires: 7 });
      // เพิ่ม Cookies.set("email", newUser.email) ได้หากต้องการ
    } else if (newStatus === "unauthorized") {
      Cookies.remove("token");
      Cookies.remove("username");
      Cookies.remove("userId");
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    updateAuthStatus("unauthorized");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        token,
        updateAuthStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook สำหรับใช้ context นี้
export const useAuthContext = () => useContext(AuthContext);
