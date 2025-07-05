import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Complain from "../models/Complain.js";

export const countStoreRoles = async (req, res) => {
  try {
    const [
      retailerCount,
      wholesalerCount,
      allProducts,
      approvedStores,
      allComplains,
    ] = await Promise.all([
      Store.countDocuments({ role: "খুচরা", status: "approved" }),
      Store.countDocuments({ role: "পাইকারি", status: "approved" }),
      Product.find({}).lean(),
      Store.find({ status: "approved" }).select("-password -otp").lean(),
      Complain.find({}).lean(),
    ]);

    return res.status(200).json({
      success: true,
      message: "ড্যাশবোর্ডের তথ্য সফলভাবে আনা হয়েছে",
      data: {
        RetailShop: retailerCount,
        WholesaleShop: wholesalerCount,
        AllProducts: allProducts,
        AllStores: approvedStores,
        AllComplains: allComplains,
      },
    });
  } catch (error) {
    console.error("Error in countStoreRoles:", error);
    return res.status(500).json({
      success: false,
      message: "ড্যাশবোর্ডের তথ্য আনা ব্যর্থ হয়েছে",
    });
  }
};
