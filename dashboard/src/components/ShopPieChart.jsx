import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { toBengaliNumber } from "bengali-number";

const ShopPieChart = ({ totalStore, retailShop, wholesaleShop }) => {
  const colors = ["#875CF5", "#FA2C37", "#FF6900"];

  const shoreData = [
    { Name: "মোট দোকান", storCount: totalStore },
    { Name: "খুচরা দোকান", storCount: retailShop },
    { Name: "পাইকারি দোকান", storCount: wholesaleShop },
  ];

  // মোট দোকান সংখ্যা হিসাব
  const totalAmount = shoreData.reduce((acc, cur) => acc + cur.storCount, 0);

  const customTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { Name, storCount } = payload[0].payload;
      return (
        <div className="bg-white shadow-md rounded-md p-2 border border-gray-300">
          <p className="text-xs text-purple-800 mb-1 font-semibold">
            নাম: {Name}
          </p>
          <p className="text-sm text-gray-600">
            দোকান সংখ্যা: {toBengaliNumber(storCount)}টি
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex items-center justify-center flex-wrap gap-2">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className="flex items-center space-x-1 justify-center"
        >
          <div
            className="w-2.5 h-2.5 rounded"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-xs capitalize text-gray-700 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={shoreData}
          dataKey="storCount"
          nameKey="Name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
          label={({ cx, cy }) => (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={15}
              fontWeight={500}
              fill="#333"
            >
              মোট দোকান সংখ্যা:{toBengaliNumber(totalStore)}টি
            </text>
          )}
        >
          {shoreData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
        <Legend content={CustomLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ShopPieChart;
