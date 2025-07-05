import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../assets/assets";

const RecentProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ঢাকা");

  const navigate = useNavigate();

  const allLocations = useMemo(() => {
    return Array.from(
      new Set(
        products.flatMap((product) => Object.keys(product.locationPrices || {}))
      )
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((product) => ({
        ...product,
        price: product.locationPrices?.[selectedLocation] || {},
      }))
      .reverse(); // latest first
  }, [searchTerm, selectedLocation]);

  return (
    <div>
      {/* Header & Filters */}
      <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-3 md:items-center">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-800 md:col-span-1">
          পণ্যর তালিকা
        </h2>

        {/* Search input - full width on small, center on large */}
        <div className="col-span-1 md:col-span-1">
          <input
            type="text"
            placeholder="পণ্য সার্চ করুন"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>

        {/* Location selector */}
        <div className="flex items-center space-x-2 md:justify-end">
          <label htmlFor="location" className="font-semibold">
            লোকেশন:
          </label>
          <select
            id="location"
            aria-label="লোকেশন নির্বাচন"
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {allLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white rounded">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-3 py-2">পণ্যের নাম</th>
              <th className="border border-gray-200 px-3 py-2">ছবি</th>
              <th className="border border-gray-200 px-3 py-2">
                খুচরা মূল্য ({selectedLocation})
              </th>
              <th className="border border-gray-200 px-3 py-2">
                পাইকারি মূল্য ({selectedLocation})
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, 10).map((product) => (
                <tr
                  onClick={() => navigate(`/product/${product.id}`)}
                  key={product.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="border border-gray-200 px-3 py-2">
                    {product.name}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <img
                      src={product.image}
                      alt={product.name || "product image"}
                      className="w-10 h-10 object-cover mx-auto rounded"
                      loading="lazy"
                    />
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {product.price.retailPrice
                      ? `${product.price.retailPrice} ৳`
                      : "N/A"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {product.price.wholesalePrice
                      ? `${product.price.wholesalePrice} ৳`
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-4 text-red-500 font-semibold text-lg"
                >
                  কোনও পণ্য পাওয়া যায়নি। 🥲
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProducts;
