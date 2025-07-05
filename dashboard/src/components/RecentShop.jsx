import { useMemo } from "react";
import { assets } from "../assets/assets";

const RecentShop = ({ allstores = [] }) => {
  const recentShops = useMemo(() => {
    return [...allstores].reverse().slice(0, 4);
  }, [allstores]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        সর্বশেষ যুক্ত হওয়া দোকান
      </h2>
      <div className="overflow-hidden bg-white">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-3 py-2">নাম</th>
              <th className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                ছবি
              </th>
              <th className="border border-gray-200 px-3 py-2">ভূমিকা</th>
              <th className="border border-gray-200 px-3 py-2">জেলা</th>
              <th className="border border-gray-200 px-3 py-2">উপজেলা</th>
            </tr>
          </thead>
          <tbody>
            {recentShops.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-200 px-3 py-4 text-gray-500"
                >
                  কোন দোকান পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              recentShops.map((shop, index) => (
                <tr
                  key={shop.id || `${shop.name}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="border border-gray-200 px-3 py-2">
                    {shop.name || "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                    <img
                      src={shop.image || assets.user}
                      alt={shop.name || "User"}
                      className="w-12 h-12 object-cover mx-auto rounded-full"
                      loading="lazy"
                    />
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {shop.role || "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {shop.district || "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {shop.upazila || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentShop;
