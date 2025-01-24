import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    // const sessionId = cookies().get("sessionId")?.value;
    // if (!sessionId) {
    //   return NextResponse.json({ error: "Not authenticated" });
    // } else if (sessionId === "admin") {
    await connectDB();
    const alldata = await postdb.find();

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
