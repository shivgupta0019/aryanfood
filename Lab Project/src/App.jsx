import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./Components/home/Footer";
import SignupPage from "./Components/User/Signup";
import LoginPage from "./Components/User/Login";
import OTPPage from "./Components/User/Otp";

import ProjectForm from "./Components/Project Master/ProjectForm";
import ProjecPage from "./Components/Project Master/ProjecPage";

import CentrallabPage from "./Components/CentralLab/CentralLabPage";
import CentralLabForm from "./Components/CentralLab/CentralLabForm";

import Dashboard from "./Components/home/Dashboard";

import ProfilePage from "./Components/User/ProfilePage";
import DownloadResults from "./Components/DownloadResults";
import ForgotPassword from "./Components/User/Forgate-Password";
import ResetPassword from "./Components/User/ResetPassword";
import UsersPage from "./Components/User/Users";
import LabManagement from "./Components/admin/LabManagement";
import TestRequestForm from "./Components/testReqForm/TestRequestForm.jsx";
import AllTestRequests from "./Components/testReqForm/AllTestRequests.jsx";
import AllReports from "./Components/testReqForm/AllReports.jsx";

import AdminRoute from "./Components/routes/AdminRoute";
import ProtectedRoute from "./Components/routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
function Layout() {
  const location = useLocation();

  // 👉 jin routes pe dashboard nahi chahiye
  const hideRoutes = [
    "/",
    "/signup",
    "/otp",
    "/forgot-password",
    "/reset-password",
  ];

  const hideDashboard = hideRoutes.includes(location.pathname);

  return (
    <>
      {/*  Dashboard sirf tab dikhe jab allowed ho */}
      {!hideDashboard && <Dashboard />}
      <Routes>
        {/* <Route path="/centrallab" element={<CentrallabPage />} /> */}
        <Route path="/centrallab/create" element={<CentralLabForm />} />
        <Route path="/centrallab/create/:id" element={<CentralLabForm />} />
        {/* <Route path="/allreports" element={<AllReports />} /> */}
        {/* <Route path="/admin" element={<LabManagement />} /> */}
        {/* <Route path="/trf" element={<TestRequestForm />} /> */}
        {/* <Route path="/project" element={<ProjecPage />} /> */}
        <Route path="/project/create/:id" element={<ProjectForm />} />
        <Route path="/project/create" element={<ProjectForm />} />
        {/* <Route path="/result" element={<DownloadResults />} /> */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/users" element={<UsersPage />} /> */}
        ///////////////////////////////////////
        <Route element={<ProtectedRoute />}>
          <Route path="/centrallab" element={<CentrallabPage />} />
          <Route path="/project" element={<ProjecPage />} />
          <Route path="/result" element={<DownloadResults />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/alltrf" element={<AllTestRequests />} />
        </Route>
        /////////////////////////////////////admin routes//
        <Route element={<AdminRoute />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/admin" element={<LabManagement />} />
          <Route path="/trf" element={<TestRequestForm />} />
          <Route path="/allreports" element={<AllReports />} />
          
        </Route>
      </Routes>
      <Footer />
    </>
  );
}
