import connectDB from "@/app/lib/mongodb";
import orderdb from "@/app/models/order";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    // const sessionId = cookies().get("sessionId")?.value;
    // if (!sessionId) {
    //   return NextResponse.json({ error: "Not authenticated" });
    // } else if (sessionId === "admin") {
    await connectDB();
    const alldata = await orderdb.find();

    if (alldata) {
      return NextResponse.json(alldata);
    }

    return NextResponse.json({ error: "Failed to get alldata" });
    // }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
