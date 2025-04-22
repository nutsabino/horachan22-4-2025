// app/api/travel/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://dealsdatav4.thaiprivilege.com/api/v4/get/lists/deals?token=pVDKThLsIWgHKXsZaMNQ8I4G4MzfVfBP&page=1&perPage=100");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
