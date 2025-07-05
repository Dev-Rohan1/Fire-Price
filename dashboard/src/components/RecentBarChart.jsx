import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RecentBarChart = ({ data }) => {
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0].payload) {
      return (
        <div className="bg-white shadow-md rounded-md p-2 border border-gray-300">
          <p className="text-xs text-purple-800 mb-1 font-semibold">
            নাম:
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-gray-600">
            খুচরা:
            {payload[0].payload.retailPrice}৳
          </p>
          <p className="text-sm text-gray-600">
            পাইকারি :{payload[0].payload.wholesalePrice}৳
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex items-center justify-center gap-2 space-x-3">
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
  };
  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid stroke="none" />
          <XAxis dataKey="name" fontSize={14} />
          <YAxis />
          <Tooltip content={customTooltip} />
          <Legend content={CustomLegend} />
          <Bar
            name={"খুচরা মূল্য"}
            radius={[7, 7, 0, 0]}
            dataKey="retailPrice"
            fill="#875CF5"
          />
          {
            <Bar
              name={"পাইকারি মূল্য"}
              radius={[7, 7, 0, 0]}
              dataKey="wholesalePrice"
              fill="#CFBEFB"
            />
          }
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RecentBarChart;
