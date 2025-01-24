import connectDB from "@/app/lib/mongodb";
import { cookies } from "next/headers";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const ndata = {
      email: data.email,
      password: data.password,
    };
    if (
      ndata.email === process.env.ADMIN_EMAIL &&
      ndata.password === process.env.ADMIN_PASS
    ) {
      cookies().set("sessionId", "admin", {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        path: "/admin",
      });

      return NextResponse.json({ message: "admin" });
    } else return NextResponse.json({ error: "no admin" });
  } catch (err: any) {
    return NextResponse.json({ error: err });
  }
}
