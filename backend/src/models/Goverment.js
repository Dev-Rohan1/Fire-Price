import mongoose from "mongoose";

const governmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  resetOtp: {
    type: Number,
    default: null,
  },
});

const Government = mongoose.model("Government", governmentSchema);

export default Government;
