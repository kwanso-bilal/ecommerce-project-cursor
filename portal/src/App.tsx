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
import { ROUTES } from './constants/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<SignUp />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.DASHBOARD_PRODUCTS} element={<Products />} />
          <Route path={ROUTES.DASHBOARD_ORGANIZATIONS} element={<Organizations />} />
          <Route path={ROUTES.DASHBOARD_ORDERS} element={<Orders />} />
          <Route path={ROUTES.DASHBOARD_PAYMENTS} element={<Payments />} />
          <Route path={ROUTES.DASHBOARD_REVIEWS} element={<Reviews />} />
          <Route path={ROUTES.DASHBOARD_CHANGE_PASSWORD} element={<ChangePassword />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
