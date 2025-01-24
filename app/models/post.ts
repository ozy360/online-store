import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true },
  productID: { type: String },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  deletehash: [
    {
      type: String,
      required: true,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
});

const postdb = mongoose.models.post || mongoose.model("post", postSchema);
export default postdb;
