import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Bulletproof sanitization against surrounding quotes or whitespace in Vercel environment variables
if (process.env.CLOUDINARY_URL) {
  try {
    const sanitized = process.env.CLOUDINARY_URL.replace(/^["']|["']$/g, "").trim();
    new URL(sanitized);
    process.env.CLOUDINARY_URL = sanitized;
  } catch {
    // If malformed, safely delete from env so the SDK falls back to explicit credentials
    delete process.env.CLOUDINARY_URL;
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary API secret is not configured" },
        { status: 500 }
      );
    }

    if (!paramsToSign) {
      return NextResponse.json(
        { error: "Missing parameters to sign" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json(
      { error: "Failed to generate Cloudinary signature" },
      { status: 500 }
    );
  }
}
