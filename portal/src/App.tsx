import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthLayout } from './components/AuthLayout';
import { DashboardLayout } from './components/DashboardLayout';
import {
  Home,
  Login,
  SignUp,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  Dashboard,
  Products,
  Organizations,
  Orders,
  Payments,
  Reviews,
  ChangePassword,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/organizations" element={<Organizations />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          <Route path="/dashboard/reviews" element={<Reviews />} />
          <Route path="/dashboard/change-password" element={<ChangePassword />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
