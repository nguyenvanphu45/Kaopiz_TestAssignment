import { lazy, Suspense } from "react";
import { LoadingFullPage } from "../components/Loading";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

const MainPage = lazy(() => import("./MainPage"));
const LoginPage = lazy(() => import("./LoginPage"));
const RegisterPage = lazy(() => import("./RegisterPage"));
const AdminPage = lazy(() => import("./AdminPage"));
const EndUserPage = lazy(() => import("./EndUserPage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/end-user"
          element={
            <ProtectedRoute>
              <EndUserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
