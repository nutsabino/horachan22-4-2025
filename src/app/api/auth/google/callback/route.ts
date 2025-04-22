import { NextResponse } from "next/server";

const config = {
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
} as const;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("access_token");
  // กำหนดค่า providers เป็น google
  const providers = "google";

  if (!token) return NextResponse.redirect(new URL("/", request.url));

  const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:1337";
  const path = `/api/auth/google/callback`;

  const url = new URL(backendUrl + path);
  url.searchParams.append("access_token", token);
  // เพิ่ม providers เข้าไปใน params ที่จะส่งไปให้ backend
  url.searchParams.append("providers", providers);

  let web_url = process.env.WEB_URL;
  if (request.url.includes("localhost")) {
    web_url = process.env.WEB_URL;
  } else {
    web_url = request.url;
  }
  console.log("url: ", url.href);

  try {
    console.log("Attempting to fetch URL:", url.href);
    const res = await fetch(url.href);

    if (!res.ok) {
      console.error("OAuth error status:", res.status);
      let email = "";
      let errorMessage = "";

      try {
        const errorData = await res.json();
        console.error("OAuth error data:", errorData);

        errorMessage = errorData?.error?.message || "";

        const emailMatch = errorMessage.match(
          /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
        );
        if (emailMatch) {
          email = emailMatch[0];
        }

        if (errorData?.error?.details?.email) {
          email = errorData.error.details.email;
        }
      } catch (e) {
        console.error("Failed to parse error response");
      }

      if (
        errorMessage.includes("Email is already taken") ||
        errorMessage.includes("email already exists")
      ) {
        const redirectUrl = new URL("/login", web_url);
        redirectUrl.searchParams.append("error", "email_exists");
        redirectUrl.searchParams.append("attempted_provider", "google");

        if (email) {
          redirectUrl.searchParams.append("email", email);
        }

        if (errorMessage) {
          redirectUrl.searchParams.append("message", errorMessage);
        }

        return NextResponse.redirect(redirectUrl);
      }

      return NextResponse.redirect(
        new URL("/login?error=oauth_error&attempted_provider=google", web_url)
      );
    }

    const data = await res.json();
    console.log(data);

    const redirectPath = data.user.username
      ? "/"
      : "/create-profile?from_oauth=true";

    const response = NextResponse.redirect(new URL(redirectPath, web_url));

    response.cookies.set("token", data.jwt, config);
    response.cookies.set("username", data.user.username, config);

    return response;
  } catch (error) {
    console.error("Error during OAuth process:", error);
    return NextResponse.redirect(
      new URL(
        "/login?error=unexpected_error&attempted_provider=google",
        web_url
      )
    );
  }
}
