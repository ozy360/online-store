import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { ImgurClient } from "imgur";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const client = new ImgurClient({ clientId: process.env.CLIENT_ID });
    const data = await req.formData();
    const id = data.get("id");
    const findId = await postdb.findOne({ _id: id });
    if (findId) {
      findId.deletehash.map((x: string) => {
        client.deleteImage(x);
      });
    }

    await postdb.deleteOne({ _id: id });
    return NextResponse.json({ message: "Product deleted" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
