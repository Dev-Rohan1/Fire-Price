import Navbar from "../components/Navbar";
import Shops from "../components/Shops";
import Sidebar from "../components/Sidebar";

const StorePage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="hidden xl:block w-54 border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="w-full pt-4 xl:pl-4 mb-10">
          <Shops />
        </div>
      </div>
    </>
  );
};

export default StorePage;
