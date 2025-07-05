import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.DATABASE_CONNECTION_STRING}/fire-price`
    );

    console.log("✅ Database Connected Successfully");
  } catch (err) {
    console.log("❌ Database Connection Failed");
    process.exit(1);
  }
};

export default connectDB;
