import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";

import ApplicationForm from "./pages/ApplicationForm/ApplicationForm";
import ApplicationView from "./pages/ApplicationForm/ApplicationView";
import JobPosting from "./pages/JobPosting/JobPosting";
import JobPostingApplicants from "./pages/JobPosting/JobPostingApplicants.jsx";
import QuestionBank from "./pages/QuestionBank/QuestionBank.jsx";
import CreatePaper from "./pages/CreatePaper/CreatePaper.jsx";
import TestResult from "./pages/TestResult/TestResult.jsx";
import Exam from "./pages/MyExam/MyExam.jsx";
import MOUForm from "./pages/MyExam/MOUForm.jsx";
import ReExam from "./pages/ReExam/ReExam.jsx";
import Unassigned from "./pages/Unassigned/Unassigned.jsx";
import TransactionHistory from "./pages/TransactionHistory/TransactionHistory.jsx";
import MOU from "./pages/EmployeeManagement/MOU";
import FeeStructure from "./pages/EmployeeManagement/FeeStructure";
import EmployeePlaceholder from "./pages/EmployeeDashboard/EmployeePlaceholder";
import EmployeeLetters from "./pages/EmployeeDashboard/EmployeeLetters";
import EmployeeProfile from "./pages/EmployeeDashboard/EmployeeProfile";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import StudentRegistration from "./pages/StudentRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import DashboardRedirect from "./pages/DashboardRedirect";
import Settings from "./pages/Settings/Settings";
import Gallery from "./pages/Gallery/Gallery";
import Scroller from "./pages/Scroller/Scroller";
import Notifications from "./pages/Notifications/Notifications";
import Notice from "./pages/Notice/Notice.jsx";
import BlockManagement from "./pages/Admin/BlockManagement.jsx";
import PanchayatManagement from "./pages/Admin/PanchayatManagement.jsx";
import LocationManagement from "./pages/Admin/LocationManagement.jsx";
import WhatsAppTest from "./pages/Admin/WhatsAppTest.jsx";
import Logout from "./pages/Logout";


// Landing pages
import LandingDashboard from "./pages/Landing/LandingDashboard";
import JobDetail from "./pages/Landing/JobDetail";

import { AuthProvider } from "./auth/AuthProvider";
import { RequireAuth, RequireRole } from "./auth/RequireAuth";

function App() {
  // Log to identify frontend app
  console.log("🚀 FRONTEND App Running on Port 5173");

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Frontend default route - Login page */}
          <Route path="/" element={<Login />} />

          {/* Landing/Public pages - accessible without authentication */}
          <Route path="/landing" element={<LandingDashboard />} />
          <Route path="/about" element={<LandingDashboard />} />
          <Route path="/membership" element={<LandingDashboard />} />
          <Route path="/services" element={<LandingDashboard />} />
          <Route path="/jobs" element={<LandingDashboard />} />
          <Route path="/notifications" element={<LandingDashboard />} />
          <Route path="/gallery" element={<LandingDashboard />} />
          <Route path="/verification" element={<LandingDashboard />} />
          <Route path="/contacts" element={<LandingDashboard />} />
          <Route path="/job-postings/view/:id" element={<JobDetail />} />

          {/* Login page - always accessible */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/student-register" element={<StudentRegistration />} />

          {/* Protected app routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route
              path="/admin/dashboard"
              element={
                <RequireRole allow={["admin"]}>
                  <AdminDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/applicant/dashboard"
              element={
                <RequireRole allow={["applicant"]}>
                  <ApplicantDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/my-exam"
              element={
                <RequireRole allow={["applicant"]}>
                  <Exam />
                </RequireRole>
              }
            />
            <Route path="/mou/process/:id" element={<MOUForm />} />
            <Route
              path="/transactions"
              element={
                <RequireRole allow={["applicant"]}>
                  <TransactionHistory />
                </RequireRole>
              }
            />

            {/* Shared routes (both roles can open) */}
            <Route path="/job-postings" element={<JobPosting />} />
            <Route path="/job-postings/view/:id" element={<JobDetail />} />
            <Route
              path="/job-postings/:id/applicants"
              element={<JobPostingApplicants />}
            />
            <Route path="/application-form" element={<ApplicationForm />} />
            <Route
              path="/applications/view/:id"
              element={<ApplicationView />}
            />

            {/* Settings - Admin only */}
            <Route
              path="/settings"
              element={
                <RequireRole allow={["admin"]}>
                  <Settings />
                </RequireRole>
              }
            />

            {/* Gallery - Admin only */}
            <Route
              path="/admin/gallery"
              element={
                <RequireRole allow={["admin"]}>
                  <Gallery />
                </RequireRole>
              }
            />
            <Route
              path="/question-bank"
              element={
                <RequireRole allow={["admin"]}>
                  <QuestionBank />
                </RequireRole>
              }
            />
            <Route
              path="/re-exam"
              element={
                <RequireRole allow={["admin"]}>
                  <ReExam />
                </RequireRole>
              }
            />
            <Route
              path="/unassigned"
              element={
                <RequireRole allow={["admin"]}>
                  <Unassigned />
                </RequireRole>
              }
            />

            <Route
              path="/create-paper"
              element={
                <RequireRole allow={["admin"]}>
                  <CreatePaper />
                </RequireRole>
              }
            />
            <Route
              path="/test-result"
              element={
                <RequireRole allow={["admin"]}>
                  <TestResult />
                </RequireRole>
              }
            />

            {/* Employee Management - Admin only */}
            <Route
              path="/admin/mou"
              element={
                <RequireRole allow={["admin"]}>
                  <MOU />
                </RequireRole>
              }
            />
            <Route
              path="/admin/fee-structure"
              element={
                <RequireRole allow={["admin"]}>
                  <FeeStructure />
                </RequireRole>
              }
            />
            <Route
              path="/admin/whatsapp-test"
              element={
                <RequireRole allow={["admin"]}>
                  <WhatsAppTest />
                </RequireRole>
              }
            />
            <Route
              path="/admin/location-management"
              element={
                <RequireRole allow={["admin"]}>
                  <LocationManagement />
                </RequireRole>
              }
            />


            {/* Scroller - Admin only */}
            <Route
              path="/scroller"
              element={
                <RequireRole allow={["admin"]}>
                  <Scroller />
                </RequireRole>
              }
            />

            {/* Notifications - Admin only */}
            <Route
              path="/notifications-manage"
              element={
                <RequireRole allow={["admin"]}>
                  <Notifications />
                </RequireRole>
              }
            />
            <Route
              path="/notice"
              element={
                <RequireRole allow={["admin"]}>
                  <Notice />
                </RequireRole>
              }
            />

            {/* Top bar demo pages */}
            <Route
              path="/notifications-demo"
              element={<TopBarNotification />}
            />
            <Route path="/mail" element={<TopBarMail />} />

            {/* Employee Routes */}
            <Route element={<RequireRole allow={["employee"]} />}>
              <Route path="/employee/dashboard" element={<EmployeePlaceholder title="Employee Dashboard" />} />
              <Route path="/employee/feed" element={<EmployeePlaceholder title="Feed" />} />
              <Route path="/employee/cards" element={<EmployeePlaceholder title="Cards" />} />
              <Route path="/employee/leads" element={<EmployeePlaceholder title="Leads" />} />
              <Route path="/employee/my-team" element={<EmployeePlaceholder title="My Team" />} />
              <Route path="/employee/letters" element={<EmployeeLetters />} />
              <Route path="/employee/working-zone" element={<EmployeePlaceholder title="Working Zone" />} />
              <Route path="/employee/reviews" element={<EmployeePlaceholder title="Review & Ratings" />} />
              <Route path="/employee/meetings" element={<EmployeePlaceholder title="Meetings" />} />
              <Route path="/employee/announcements" element={<EmployeePlaceholder title="Announcements" />} />
              <Route path="/employee/salary" element={<EmployeePlaceholder title="Salary" />} />
              <Route path="/employee/training" element={<EmployeePlaceholder title="Training" />} />
              <Route path="/employee/profile" element={<EmployeeProfile />} />
              <Route path="/employee/hire-team" element={<EmployeePlaceholder title="Hire Team" />} />
              <Route path="/employee/attendance" element={<EmployeePlaceholder title="Attendance" />} />
              <Route path="/employee/support" element={<EmployeePlaceholder title="Support" />} />
            </Route>

            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* Catch-all: redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
