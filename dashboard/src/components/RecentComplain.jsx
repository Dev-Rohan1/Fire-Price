const RecentComplain = ({ allComplains }) => {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-3 mt-5">
        সর্বশেষ অভিযোগ
      </h2>
      <div className="bg-white overflow-x-auto">
        {" "}
        <div className="min-w-[1000px] border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 border-b border-gray-300 font-semibold text-gray-700 text-sm">
            <div className="col-span-1">নাম</div>
            <div className="col-span-1">মোবাইল নম্বর</div>
            <div className="col-span-1">বিভাগ</div>
            <div className="col-span-1">উপজেলা</div>
            <div className="col-span-1">অভিযোগের বিষয়</div>
          </div>

          {/* Table Rows */}
          {allComplains && allComplains.length > 0 ? (
            allComplains
              .reverse()
              .slice(0, 4)
              .map((complain) => (
                <div
                  key={complain._id}
                  className="grid grid-cols-5 gap-4 p-4 border-b border-gray-50 text-sm text-gray-800 transition"
                >
                  <div className="col-span-1">{complain.name || "N/A"}</div>
                  <div className="col-span-1">
                    {complain.mobileNumber || "N/A"}
                  </div>
                  <div className="col-span-1">{complain.division || "N/A"}</div>
                  <div className="col-span-1">{complain.upazila || "N/A"}</div>
                  <div className="col-span-1">
                    {complain.complainSubject
                      ? `${complain.complainSubject.slice(0, 20)}${
                          complain.complainSubject.length > 20 ? "..." : ""
                        }`
                      : "N/A"}
                  </div>
                </div>
              ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              কোনো অভিযোগ পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentComplain;
