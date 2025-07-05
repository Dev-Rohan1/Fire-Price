import { toBengaliNumber } from "bengali-number";
import { Store } from "lucide-react";

const ShopCart = ({ totalStore, retailShop, wholesaleShop }) => {
  return (
    <div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-4 border border-gray-200 rounded-md shadow-xs">
          <div className="w-14 h-14 bg-blue-500 text-white rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              মোট দোকান সংখ্যা
            </h3>
            <p className="text-gray-600">{toBengaliNumber(totalStore)}টি</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 border border-gray-200 rounded-md shadow-xs">
          <div className="w-14 h-14 bg-green-500 text-white rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              খুচরা দোকান
            </h3>
            <p className="text-gray-600">{toBengaliNumber(retailShop)}টি</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 border border-gray-200 rounded-md shadow-xs">
          <div className="w-14 h-14 bg-red-500 text-white rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              পাইকারি দোকান
            </h3>
            <p className="text-gray-600">{toBengaliNumber(wholesaleShop)}টি</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
