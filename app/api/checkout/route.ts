import connectDB from "@/app/lib/mongodb";
import orderdb from "@/app/models/order";
import { sendEmail } from "@/app/helpers/mail";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    // console.log(processedItems);

    // return NextResponse.json({ message: "ok" });

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const norder = new orderdb({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      orderDate: `${year}/${month}/${day}`,
      subtotal: data.total,
      shippingAddress: {
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip,
      },
    });
    const save = await norder.save();
    console.log(save._id.toString());
    if (!save) return NextResponse.json({ error: "Error, try again" });

    await Promise.all(
      data.items.map(async (x: any) => {
        const processedItems = {
          productId: x._id,
          name: x.name,
          quantity: x.quantity,
          price: x.price,
          image: x.images[0],
          subtotal: Number(x.quantity * x.price),
        };

        await orderdb.findOneAndUpdate(
          { _id: save._id.toString() },
          {
            $push: {
              items: processedItems,
            },
          }
        );
      })
    );

    await sendEmail({
      email: data.email,
      emailType: "ORDER",
      id: save._id.toString(),
    });
    return NextResponse.json({ message: "Order placed" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
