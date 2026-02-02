import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLayout from "./components/layout/AdminLayout";
import InstructorLayout from "./components/layout/InstructorLayout";
import StudentLayout from "./components/layout/StudentLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ApproveUsers from "./pages/admin/ApproveUsers";

import ProfileManagement from "./pages/admin/ProfileManagement";
import ApproveCourses from "./pages/admin/ApproveCourses";
import AssignCourse from "./pages/admin/AssignCourse";
import CertificateConfig from "./pages/admin/CertificateConfig";
import AddInstructor from "./pages/admin/AddInstructor";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import AddCourse from "./pages/instructor/AddCourse";
import CourseList from "./pages/instructor/CourseList";
import ExamBuilder from "./pages/instructor/ExamBuilder";
import InstructorSettings from "./pages/instructor/InstructorSettings";
import InstructorPracticeList from "./pages/instructor/PracticeList";
import AddPractice from "./pages/instructor/AddPractice";

import StudentDashboard from "./pages/student/StudentDashboard";
import CoursePlayer from "./pages/student/CoursePlayer";
import ExamRunner from "./pages/student/ExamRunner";
import MyCertificates from "./pages/student/MyCertificates";
import StudentCourses from "./pages/student/StudentCourses";
import StudentPerformance from "./pages/instructor/StudentPerformance";
import CourseDetail from "./pages/student/CourseDetail/index";
import ManageUsers from "./pages/admin/ManageUsers";
import Suspended from "./pages/auth/Suspended";
import PracticeSession from "./pages/student/PracticeSession";
import PracticeList from "./pages/student/PracticeList";
import Landing from "./pages/Landing";
import ProfileSettings from "./pages/shared/ProfileSettings";
import StudentExams from "./pages/student/StudentExams";
import WeeklyContest from "./pages/student/WeeklyContest";
import ContestDetail from "./pages/student/WeeklyContest/ContestDetail";
import ContestManagement from "./pages/instructor/ContestManagement";
import CreateContest from "./pages/instructor/ContestManagement/CreateContest";
import Leaderboard from './pages/student/Leaderboard';
import { SocketProvider } from './context/SocketContext';
import InstructorChat from './pages/instructor/InstructorChat';
import StudentChat from './pages/student/StudentChat';
import AssignmentBuilder from "./pages/instructor/AssignmentBuilder";
import InstructorAssignments from "./pages/instructor/InstructorAssignments";
import SubmissionGrader from "./pages/instructor/SubmissionGrader";
import StudentAssignments from "./pages/student/StudentAssignments";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />

              <Route path="add-instructor" element={<AddInstructor />} />
              <Route path="approve-users" element={<ApproveUsers />} />
              <Route path="approve-courses" element={<ApproveCourses />} />
              <Route path="assign-course" element={<AssignCourse />} />
              <Route path="certificates" element={<CertificateConfig />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="profile-management" element={<ProfileManagement />} />
            </Route>

            <Route
              path="/instructor"
              element={
                <ProtectedRoute allowedRoles={["instructor", "company"]}>
                  <InstructorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="courses" element={<CourseList />} />
              <Route path="practice" element={<InstructorPracticeList />} />
              <Route path="practice/new" element={<AddPractice />} />
              <Route path="contests" element={<ContestManagement />} />
              <Route path="contests/create" element={<CreateContest />} />
              <Route path="exams" element={<ExamBuilder />} />
              <Route path="performance" element={<StudentPerformance />} />
              <Route path="chat" element={<InstructorChat />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="course/:courseId/assignments" element={<InstructorAssignments />} />
              <Route path="course/:courseId/assignments/new" element={<AssignmentBuilder />} />
              <Route path="assignment/:assignmentId/submissions" element={<SubmissionGrader />} />
            </Route>

            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student", "learner"]}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="course/:courseId" element={<CourseDetail />} />
              <Route path="course/:courseId/learn" element={<CoursePlayer />} />
              <Route
                path="practice/session/:challengeId"
                element={<PracticeSession />}
              />
              <Route path="practice" element={<PracticeList />} />
              <Route path="exams" element={<StudentExams />} />
              <Route path="exam/:examId" element={<ExamRunner />} />
              <Route path="contests" element={<WeeklyContest />} />
              <Route path="contest/:contestId" element={<ContestDetail />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="certificates" element={<MyCertificates />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="chat" element={<StudentChat />} />
              <Route path="course/:courseId/assignments" element={<StudentAssignments />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/suspended" element={<Suspended />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
