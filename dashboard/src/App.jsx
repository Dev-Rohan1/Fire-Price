import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ import protected route
import ViewComplain from "./components/ViewComplain";
import ViewProduct from "./components/ViewProduct";
import ViewStore from "./components/ViewStore";
import AppLayout from "./layout/AppLayout";
import AddProductPage from "./pages/AddProductPage";
import ComplainPage from "./pages/ComplainPage";
import DashboardPage from "./pages/DashboardPage";
import EditProductPage from "./pages/EditProductPage";
import ForgetPassword from "./pages/ForgetPassword";
import LoginPage from "./pages/LoginPage";
import ProductList from "./pages/ProductList";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import ShopRequestPage from "./pages/ShopRequestPage";

const App = () => {
  return (
    <Routes>
      <Route path="/admin-login" element={<LoginPage />} />
      <Route path="/admin-forget-password" element={<ForgetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AddProductPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product-list"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProductList />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ViewProduct />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditProductPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complain"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ComplainPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complain/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ViewComplain />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ShopPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop-request"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ShopRequestPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/store/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ViewStore />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
