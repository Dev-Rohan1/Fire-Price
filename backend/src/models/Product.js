import mongoose from "mongoose";

const locationPriceSchema = new mongoose.Schema(
  {
    retailPrice: { type: Number, required: true },
    wholesalePrice: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    locationPrices: {
      type: Map,
      of: locationPriceSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
