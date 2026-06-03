import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "delivergo",
    timestamp: new Date().toISOString(),
  });
}
