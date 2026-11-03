import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { SignJWT } from "jose";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secretKey = process.env.AUTH_BRIDGE_SECRET;
    if (!secretKey) {
      return NextResponse.json(
        { message: "Bridge secret not configured" },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(secretKey);
    const bridgeToken = await new SignJWT({
      email: session.user.email,
      name: session.user.name,
      photoURL: session.user.image || "",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(secret);

    return NextResponse.json({ bridgeToken });
  } catch (error) {
    console.error("Bridge token generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate bridge token" },
      { status: 500 }
    );
  }
}

