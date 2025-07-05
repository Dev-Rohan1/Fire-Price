import mongoose from "mongoose";

const complainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    division: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    upazila: {
      type: String,
      required: true,
      trim: true,
    },
    complainSubject: {
      type: String,
      required: true,
      trim: true,
    },
    complainDetails: {
      type: String,
      required: true,
      trim: true,
    },
    complainProve: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Complain = mongoose.model("Complain", complainSchema);

export default Complain;
