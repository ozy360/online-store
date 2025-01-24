import connectDB from "@/app/lib/mongodb";
import orderdb from "@/app/models/order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    const findId = await orderdb.findOneAndUpdate({
      _id: data.id,
      status: data.status,
    });
    if (findId) return NextResponse.json({ message: "Status changed" });
    else return NextResponse.json({ message: "Status not changed" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
