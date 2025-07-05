import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, locationPrices } = req.body;

    if (!name || !locationPrices) {
      return res.status(400).json({
        success: false,
        message: "Name and locationPrices are required.",
      });
    }

    let parsedLocationPrices;
    try {
      parsedLocationPrices =
        typeof locationPrices === "string"
          ? JSON.parse(locationPrices)
          : locationPrices;
    } catch (parseError) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid locationPrices format." });
    }

    const image = req.file;

    const uplodImage = await cloudinary.uploader.upload(image.path);

    const product = new Product({
      name,
      locationPrices: parsedLocationPrices,
      image: uplodImage.secure_url,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: "পণ্য যুক্ত সকল হয়েছে",
      data: savedProduct,
    });
  } catch (err) {
    console.error("Error saving product:", err.message);
    return res.status(500).json({
      success: false,
      message: "পণ্য যুক্ত ব্যর্থ হয়েছে",
      error: err.message,
    });
  }
};

export const productFindByID = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "অবৈধ পণ্যের আইডি প্রদান করা হয়েছে",
    });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "পণ্য খুঁজে পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      message: "পণ্য সফলভাবে পাওয়া গেছে",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({
      success: false,
      message: "সার্ভার ত্রুটি ঘটেছে, অনুগ্রহ করে পরে চেষ্টা করুন",
    });
  }
};

export const productList = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "পণ্য তালিকা পাওয়া ব্যর্থ হয়েছে",
      });
    }

    return res.status(200).json({
      success: true,
      message: "পণ্য তালিকা পাওয়া গেছে",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "পণ্য তালিকা পাওয়া ব্যর্থ হয়েছে",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "পণ্যের আইডি প্রদান করা হয়নি",
    });
  }

  try {
    let updateData = { ...req.body };
    if (
      updateData.locationPrices &&
      typeof updateData.locationPrices === "string"
    ) {
      updateData.locationPrices = JSON.parse(updateData.locationPrices);
    }

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path);

      if (uploadedImage && uploadedImage.secure_url) {
        updateData.image = uploadedImage.secure_url;
      }
    }

    delete updateData._id;
    delete updateData.__v;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "পণ্য খুঁজে পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      message: "পণ্য সফলভাবে আপডেট করা হয়েছে",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Product update error:", error);
    return res.status(500).json({
      success: false,
      message: "পণ্য আপডেট ব্যর্থ হয়েছে",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "পণ্যের আইডি প্রদান করা হয়নি",
    });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "পণ্য খুঁজে পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      message: "পণ্য সফলভাবে ডিলিট করা হয়েছে",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "পণ্য ডিলিট ব্যর্থ হয়েছে",
    });
  }
};
