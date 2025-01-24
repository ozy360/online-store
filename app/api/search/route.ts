import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const data = await req.formData();
    const query = data.get("query");

    if (typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query parameter" });
    }

    // const alldata = await userdb.find();
    const items = await postdb
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
      .limit(10);

    if (items.length) return NextResponse.json(items);
    else return NextResponse.json({ error: "Nothing found" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
