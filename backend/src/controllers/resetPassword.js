import Store from "../models/Store.js";
import bcrypt from "bcrypt";

export const storeResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "সকল তথ্য প্রদান করুন",
    });
  }

  try {
    const store = await Store.findOne({ email });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "স্টোর খুঁজে পাওয়া যায়নি",
      });
    }

    if (store.resetOtp != otp) {
      return res.status(400).json({
        success: false,
        message: "ভুল OTP প্রদান করা হয়েছে",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    store.password = hashedPassword;
    store.resetOtp = null;

    await store.save();

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
