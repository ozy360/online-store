import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.formData();
    const id = data.get("id");
    const title = data.get("title");
    const price = data.get("price");
    const description = data.get("description");
    const findId = await postdb.findOne({ _id: id });

    // await postdb.deleteOne({ _id: id });
    return NextResponse.json({ message: "Product uploaded" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
