import { Suspense } from "react";
import LoginPage from "@/src/components/pages/Login";

export default function LoginPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          กำลังโหลด...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
