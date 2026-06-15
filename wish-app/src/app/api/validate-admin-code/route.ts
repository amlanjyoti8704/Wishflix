import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json();

    if (!adminCode || typeof adminCode !== "string") {
      return NextResponse.json(
        { valid: false, message: "Admin code is required" },
        { status: 400 }
      );
    }

    const serverAdminCode = process.env.ADMIN_CODE;

    if (!serverAdminCode) {
      console.error("ADMIN_CODE environment variable is not set");
      return NextResponse.json(
        { valid: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const isValid = adminCode === serverAdminCode;

    if (!isValid) {
      return NextResponse.json(
        { valid: false, message: "Invalid admin code" },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json(
      { valid: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}