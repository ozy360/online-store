import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // const sessionId = cookies().get("sessionId")?.value;
    // if (!sessionId) {
    //   return NextResponse.json({ error: "Not authenticated" });
    // } else if (sessionId === "admin") {
    await connectDB();
    const path = req.nextUrl.pathname;
    const id = path.split("/").pop();

    const data = await postdb.findOne({ _id: id });
    if (data) {
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Failed to get data" });
    // }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
