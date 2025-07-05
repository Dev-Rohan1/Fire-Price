import { v2 as cloudinary } from "cloudinary";
import Complain from "../models/Complain.js";

export const sendComplainController = async (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      division,
      district,
      upazila,
      complainSubject,
      complainDetails,
    } = req.body;

    const file = req.file;

    if (
      !name?.trim() ||
      !mobileNumber?.trim() ||
      !division?.trim() ||
      !district?.trim() ||
      !upazila?.trim() ||
      !complainSubject?.trim() ||
      !complainDetails?.trim() ||
      !file
    ) {
      return res.status(400).json({
        success: false,
        message: "সকল প্রয়োজনীয় তথ্য এবং প্রমাণ ছবি প্রদান করুন।",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path);

    const newComplain = new Complain({
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      division: division.trim(),
      district: district.trim(),
      upazila: upazila.trim(),
      complainSubject: complainSubject.trim(),
      complainDetails: complainDetails.trim(),
      complainProve: uploadResult.secure_url,
    });

    await newComplain.save();

    return res.status(201).json({
      success: true,
      message: "আপনার অভিযোগটি সফলভাবে প্রেরণ করা হয়েছে।",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "অভিযোগ প্রেরণ ব্যর্থ হয়েছে, আবার চেষ্টা করুন।",
    });
  }
};

export const getAllComplains = async (req, res) => {
  try {
    const complains = await Complain.find();
    return res.status(200).json({
      success: true,
      message: "সকল অভিযোগ প্রদর্শন করা হয়েছে",
      complains,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "অভিযোগ প্রেরণ ব্যর্থ হয়েছে, আবার চেষ্টা করুন।",
    });
  }
};

export const getComplainById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "অভিযোগের আইডি প্রদান করা হয়নি",
    });
  }

  try {
    const complain = await Complain.findById(id);

    if (!complain) {
      return res.status(404).json({
        success: false,
        message: "অভিযোগ খুঁজে পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      message: "অভিযোগের বিস্তারিত প্রদর্শন করা হয়েছে",
      complainData: complain,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "অভিযোগ প্রেরণ ব্যর্থ হয়েছে, আবার চেষ্টা করুন।",
      error: error.message,
    });
  }
};
