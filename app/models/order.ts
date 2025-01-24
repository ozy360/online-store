import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  orderDate: { type: String },
  email: { type: String },
  status: {
    type: String,
    enum: ["Placed", "Shipped", "Delivered"],
    default: "Placed",
  },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      image: String,
      subtotal: Number,
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  subtotal: { type: Number },
  tax: { type: Number },
  shippingCost: { type: Number },
  totalAmount: { type: Number },
});

const orderdb = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderdb;
