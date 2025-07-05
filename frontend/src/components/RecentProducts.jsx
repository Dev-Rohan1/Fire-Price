import { useEffect, useMemo, useState } from "react";
// import RecentBarChart from "./RecentBarChart";
import { toBengaliNumber } from "bengali-number";
import RecentBarChart from "./RecentBarChart";

const RecentProducts = ({ allProducts }) => {
  const [data, setData] = useState([]);

  // Extract unique location keys
  const allLocations = useMemo(() => {
    return Array.from(
      new Set(
        allProducts.flatMap((product) =>
          product.locationPrices ? Object.keys(product.locationPrices) : []
        )
      )
    );
  }, [allProducts]);

  const [selectedLocation, setSelectedLocation] = useState("");

  // Set default location when available
  useEffect(() => {
    if (allLocations.length > 0 && !selectedLocation) {
      setSelectedLocation(allLocations[0]);
    }
  }, [allLocations, selectedLocation]);

  // Get latest 3 products
  const latestProducts = useMemo(() => {
    return [...allProducts].reverse().slice(0, 3);
  }, [allProducts]);

  // Prepare data for chart
  useEffect(() => {
    if (!selectedLocation) return;

    const transformed = latestProducts.map((item) => {
      const price = item.locationPrices?.[selectedLocation] || {};
      return {
        name: item.name,
        retailPrice: Number(price.retailPrice) || 0,
        wholesalePrice: Number(price.wholesalePrice) || 0,
      };
    });

    setData(transformed);
  }, [selectedLocation, latestProducts]);

  return (
    <>
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold text-gray-800">সর্বশেষ পণ্য</h2>
          <div className="flex items-center">
            <label htmlFor="location" className="mr-2 font-semibold">
              লোকেশন:
            </label>
            <select
              id="location"
              aria-label="লোকেশন নির্বাচন"
              className="border border-gray-300 px-2 py-1 outline-0"
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

        <div className="overflow-x-auto bg-white">
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-3 py-2">পণ্যের নাম</th>
                <th className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                  ছবি
                </th>
                <th className="border border-gray-200 px-3 py-2">
                  খুচরা মূল্য ({selectedLocation})
                </th>
                <th className="border border-gray-200 px-3 py-2">
                  পাইকারি মূল্য ({selectedLocation})
                </th>
              </tr>
            </thead>
            <tbody>
              {latestProducts.map((product, index) => {
                const price = product.locationPrices?.[selectedLocation];
                return (
                  <tr key={product._id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">
                      {product.name}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 hidden md:table-cell">
                      <img
                        src={product.image}
                        alt={product.name || "product image"}
                        className="w-10 h-10 object-cover mx-auto"
                        loading="lazy"
                      />
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {price?.retailPrice != null
                        ? `${toBengaliNumber(String(price.retailPrice))} ৳`
                        : "N/A"}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {price?.wholesalePrice != null
                        ? `${toBengaliNumber(String(price.wholesalePrice))} ৳`
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional: Bar chart visualization */}
      <RecentBarChart data={data} />
    </>
  );
};

export default RecentProducts;
