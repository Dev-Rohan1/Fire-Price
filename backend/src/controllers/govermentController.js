import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import Government from "../models/Goverment.js";

import generateToken from "../utils/generateToken.js";
import transporter from "../utils/nodeMailer.js";

export const govermentRegister = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const image = req.file;

  if (!name || !email || !password || !image || !phone) {
    return res.status(400).json({
      success: false,
      message: "সকল তথ্য প্রদান করুন",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const govermentImageUploadUrl = await cloudinary.uploader.upload(
      image.path
    );

    const newGoverment = new Government({
      name,
      email,
      password: hashedPassword,
      phone,
      image: govermentImageUploadUrl.secure_url,
    });

    await newGoverment.save();

    return res.status(201).json({
      success: true,
      message: "প্রশাসক রেজিস্ট্রেশন সফল হয়েছে",
      govermentData: {
        _id: newGoverment._id,
        name: newGoverment.name,
        email: newGoverment.email,
        image: newGoverment.image,
        token: await generateToken(newGoverment._id),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "প্রশাসক রেজিস্ট্রেশন ব্যর্থ হয়েছে",
    });
  }
};

export const govermentLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "সকল তথ্য প্রদান করুন",
    });
  }

  try {
    const goverment = await Government.findOne({ email });

    if (!goverment) {
      return res.status(401).json({
        success: false,
        message: "একাউন্ট খুঁজে পাওয়া যায়নি",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, goverment.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "পাসওয়ার্ড সঠিক নয়",
      });
    }

    return res.status(200).json({
      success: true,
      message: "প্রশাসক লগইন সফল হয়েছে",
      govermentData: {
        _id: goverment._id,
        name: goverment.name,
        email: goverment.email,
        image: goverment.image,
        token: await generateToken(goverment._id),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "লগইন প্রক্রিয়ায় সমস্যা হয়েছে",
    });
  }
};

export const getGovermentData = async (req, res) => {
  const govId = req.id;

  try {
    const government = await Government.findById(govId).select(
      "-password -resetOtp"
    );

    return res.status(200).json({
      success: true,
      message: "প্রশাসকের তথ্য সফলভাবে পাওয়া গেছে",
      govermentData: government,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "প্রশাসকের তথ্য সংগ্রহ ব্যর্থ হয়েছে",
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "ইমেইল প্রদান করুন",
    });
  }

  try {
    const government = await Government.findOne({ email });

    if (!government) {
      return res.status(404).json({
        success: false,
        message: "এই ইমেইল প্রশাসক খুঁজে পাওয়া যায়নি",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    government.resetOtp = otp;
    await government.save();

    const mailOptions = {
      from: "mdrohanulhaquerohan368@gmail.com",
      to: email,
      subject: "পাসওয়ার্ড রিসেট OTP",
      text: `আপনার পাসওয়ার্ড রিসেটের OTP হলো: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP সফলভাবে ইমেইলে পাঠানো হয়েছে",
    });
  } catch (error) {
    console.error("OTP পাঠাতে সমস্যা হয়েছে:", error);
    return res.status(500).json({
      success: false,
      message: "OTP পাঠানো ব্যর্থ হয়েছে",
    });
  }
};

export const verifyResetAndChangePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!otp || !email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "সকল তথ্য প্রদান করুন",
    });
  }

  try {
    const goverment = await Government.findOne({ email });

    if (!goverment) {
      return res.status(404).json({
        success: false,
        message: "প্রশাসক খুঁজে পাওয়া যায়নি",
      });
    }

    if (goverment.resetOtp != otp) {
      return res.status(400).json({
        success: false,
        message: "ভুল OTP প্রদান করা হয়েছে",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    goverment.password = hashedPassword;
    goverment.resetOtp = null;

    await goverment.save();

    return res.status(200).json({
      success: true,
      message: "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে",
    });
  }
};

export const govermentEditProfile = async (req, res) => {
  const { name, password, phone } = req.body;
  const image = req.file;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "সকল তথ্য প্রদান করুন",
    });
  }

  try {
    const govId = req.id;

    const updateData = {
      name,
      phone,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image.path);
      updateData.image = uploadedImage.secure_url;
    }

    const updatedGov = await Government.findByIdAndUpdate(govId, updateData);

    if (!updatedGov) {
      return res.status(404).json({
        success: false,
        message: "প্রোফাইল খুঁজে পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      message: "তথ্য সফলভাবে পরিবর্তন করা হয়েছে",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "তথ্য পরিবর্তন ব্যর্থ হয়েছে",
    });
  }
};


