import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import Store from "../models/Store.js";
import generateToken from "../utils/generateToken.js";
import transporter from "../utils/nodeMailer.js";

export const storeRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      address,
      division,
      district,
      upazila,
    } = req.body;

    const image = req.file;

    // Field validation
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !role ||
      !address ||
      !division ||
      !district ||
      !upazila ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "সকল তথ্য প্রদান করুন",
      });
    }

    const existing = await Store.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "এই ইমেইলটি ইতোমধ্যে ব্যবহৃত হয়েছে",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadResult = await cloudinary.uploader.upload(image.path);

    const newStore = new Store({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      address,
      division,
      district,
      upazila,
      image: uploadResult.secure_url,
      status: "pending",
    });

    await newStore.save();

    const mailOptions = {
      from: "mdrohanulhaquerohan368@gmail.com",
      to: email,
      subject: "আপনার দোকান রেজিস্ট্রেশন সফল হয়েছে | ন্যায্যমূল্য প্ল্যাটফর্ম",
      html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333;">
      <h2 style="color: #008000;">📋 স্টোর রেজিস্ট্রেশন সম্পন্ন</h2>
      
      <p>প্রিয় <strong>${name}</strong>,</p>

      <p>আপনার দোকানের রেজিস্ট্রেশন <strong>ন্যায্যমূল্য ওয়েবসাইটে</strong> সফলভাবে সম্পন্ন হয়েছে।</p>

      <p>বর্তমানে আপনার অ্যাকাউন্ট <strong>প্রশাসকের অনুমোদনের অপেক্ষায় রয়েছে</strong>। অনুমোদনের পর আপনি লগইন করে আপনার স্টোর পরিচালনা করতে পারবেন।</p>

      <p style="margin-top: 20px;">আমাদের সঙ্গে থাকার জন্য ধন্যবাদ।</p>

      <p>শুভেচ্ছান্তে,<br/>
      <strong>ন্যায্যমূল্য টিম</strong></p>

      <hr/>
      <small style="color: #777;">এই ইমেইলটি স্বয়ংক্রিয়ভাবে প্রেরিত হয়েছে, অনুগ্রহ করে সরাসরি উত্তর প্রদান করবেন না।</small>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message:
        "স্টোর রেজিস্ট্রেশন সফল হয়েছে। প্রশাসকের অনুমোদনের পর লগইন করা যাবে।",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "স্টোর রেজিস্ট্রেশন ব্যর্থ হয়েছে",
    });
  }
};

export const storeLogin = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "সকল তথ্য প্রদান করুন",
      });
    }

    const store = await Store.findOne({ email });

    if (!store || store.phone !== phone) {
      return res.status(401).json({
        success: false,
        message: "ইমেইল অথবা ফোন নম্বর ভুল হয়েছে",
      });
    }

    if (store.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "আপনার অ্যাকাউন্ট এখনো প্রশাসক দ্বারা অনুমোদিত হয়নি",
      });
    }

    if (store.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "আপনার অ্যাকাউন্ট বাতিল করা হয়েছে",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, store.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "পাসওয়ার্ড সঠিক নয়",
      });
    }

    return res.status(200).json({
      success: true,
      message: "লগইন সফল হয়েছে",
      token: generateToken(store._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "লগইন ব্যর্থ হয়েছে",
    });
  }
};

export const storeGetData = async (req, res) => {
  try {
    const storeId = req.id;

    console.log(storeId);

    const store = await Store.findById(storeId).select("-password -otp");

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "স্টোর খুঁজে পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      message: "স্টোরের তথ্য সফলভাবে পাওয়া গেছে",
      storeData: store,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "স্টোরের তথ্য সংগ্রহ ব্যর্থ হয়েছে",
    });
  }
};

export const getStoreById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "স্টোরের আইডি প্রদান করা হয়নি",
    });
  }

  try {
    const store = await Store.findById(id).select("-password -otp");
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "স্টোর খুঁজে পাওয়া যায়নি",
      });
    }
    return res.status(200).json({
      success: true,
      message: "স্টোরের তথ্য সফলভাবে পাওয়া গেছে",
      storeData: store,
    });

    return res.status(200).json({
      success: true,
      message: "স্টোরের তথ্য সফলভাবে পাওয়া গেছে",
      storeData: store,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "স্টোরের তথ্য সংগ্রহ ব্যর্থ হয়েছে",
    });
  }
};

export const getAllStoreList = async (req, res) => {
  try {
    const store = await Store.find({ status: "approved" }).select(
      "-password -otp"
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "সকল স্টোরের তালিকা পাওয়া ব্যর্থ হয়েছে",
      });
    }

    return res.json({
      success: true,
      message: "সকল স্টোরের তালিকা পাওয়া গেছে",
      storeList: store,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "সকল স্টোরের তালিকা পাওয়া ব্যর্থ হয়েছে",
    });
  }
};

export const getAllStoreReqList = async (req, res) => {
  try {
    const storeList = await Store.find();

    return res.status(200).json({
      success: true,
      message: "সকল স্টোরের তালিকা পাওয়া গেছে",
      reqStoreList: storeList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "সকল স্টোরের তালিকা পাওয়া ব্যর্থ হয়েছে",
    });
  }
};

export const changeStoreStatus = async (req, res) => {
  const { storeId, status } = req.body;

  if (!storeId || !status) {
    return res.status(400).json({
      success: false,
      message: "সকল তথ্য প্রদান করুন",
    });
  }

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "স্টোর খুঁজে পাওয়া যায়নি",
      });
    }

    store.status = status.toLowerCase();
    await store.save();

    if (["approved", "rejected"].includes(store.status)) {
      const statusText =
        store.status === "approved" ? "অনুমোদিত" : "প্রত্যাখ্যাত";
      const actionText =
        store.status === "approved"
          ? "আপনি এখন লগইন করে আপনার স্টোর পরিচালনা করতে পারবেন।"
          : "আপনার প্রদত্ত তথ্যের ভিত্তিতে প্রশাসক স্টোরটি অনুমোদন করতে পারেননি। আপনি চাইলে পুনরায় রেজিস্ট্রেশন করতে পারেন।";

      const mailOptions = {
        from: "mdrohanulhaquerohan368@gmail.com",
        to: store.email,
        subject:
          "আপনার স্টোরের স্ট্যাটাস পরিবর্তিত হয়েছে | ন্যায্যমূল্য প্ল্যাটফর্ম",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333;">
            <h2 style="color: #2E8B57;">📢 স্ট্যাটাস আপডেট</h2>
            <p>প্রিয় <strong>${store.name}</strong>,</p>
            <p>আপনার স্টোরের স্ট্যাটাস <strong>${statusText}</strong> করা হয়েছে।</p>
            <p>${actionText}</p>
            <p style="margin-top: 20px;">ধন্যবাদান্তে,<br>
            <strong>ন্যায্যমূল্য প্রশাসন</strong></p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({
      success: true,
      message: "স্টোরের স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "স্টোরের স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে",
    });
  }
};

export const storeEditProfile = async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    address,
    division,
    district,
    upazila,
  } = req.body;
  const image = req.file;

  try {
    const storeId = req.id;

    if (!storeId) {
      return res.status(401).json({
        success: false,
        message: "অথেনটিকেশন তথ্য পাওয়া যায়নি",
      });
    }

    // Build updateData only with provided fields to avoid overwriting with undefined
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim();
    if (phone) updateData.phone = phone.trim();
    if (role) updateData.role = role.trim();
    if (address) updateData.address = address.trim();
    if (division) updateData.division = division.trim();
    if (district) updateData.district = district.trim();
    if (upazila) updateData.upazila = upazila.trim();

    // Only hash and update password if provided and not empty string
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    if (image) {
      // Upload to Cloudinary and save secure_url
      const uploadedImage = await cloudinary.uploader.upload(image.path);
      updateData.image = uploadedImage.secure_url;
    }

    // Update the store document and return the new version
    const updatedStore = await Store.findByIdAndUpdate(storeId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStore) {
      return res.status(404).json({
        success: false,
        message: "প্রোফাইল খুঁজে পাওয়া যায়নি",
      });
    }

    return res.status(200).json({
      success: true,
      message: "তথ্য সফলভাবে পরিবর্তন করা হয়েছে",
      data: updatedStore,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "তথ্য পরিবর্তন ব্যর্থ হয়েছে",
      error: error.message,
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
    const store = await Store.findOne({ email });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "এই ইমেইল স্টোর খুঁজে পাওয়া যায়নি",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    store.resetOtp = otp;
    await store.save();

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
