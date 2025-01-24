import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";
import Randomstring from "randomstring";
import { ImgurClient } from "imgur";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const orderID = Randomstring.generate({
      length: 7,
      charset: ["numeric"],
    });
    const data = await req.formData();
    const entries = Array.from(data.entries());
    // const obj = Object.fromEntries(data.entries());
    let productName;
    let productDetails;
    let productPrice;
    let images = [];
    let deletehash = [];

    for (const entry of entries) {
      const [name, value] = entry;

      if (!(value instanceof File)) {
        const parseData = JSON.parse(value);
        productName = parseData.name;
        productDetails = parseData.details;
        productPrice = parseData.price;
      }

      if (value instanceof File) {
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString("base64");

        const client = new ImgurClient({ clientId: process.env.CLIENT_ID });
        const response = await client.upload({
          image: base64String as unknown as any,
        });

        images.push(response.data.link);
        deletehash.push(response.data.deletehash);
      }

      if (images.length > 2) {
        const npost = new postdb({
          name: productName,
          details: productDetails,
          price: productPrice,
          images: images,
          deletehash: deletehash,
        });
        const save = await npost.save();
        if (save) return NextResponse.json({ message: "ok" });
        else return NextResponse.json({ error: "no save" });
      }
    }
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
