import { Route, Routes } from "react-router-dom";
import ComplainBox from "./components/ComplainBox";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ForgetPassword from "./pages/ForgetPassword";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import StorePage from "./pages/StorePage";
import ViewProductPage from "./pages/ViewProductPage";
import ViewStore from "./pages/ViewStore";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ViewProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/complain" element={<ComplainBox />} />
        <Route path="/stores" element={<StorePage />} />
        <Route path="/store/:id" element={<ViewStore />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
