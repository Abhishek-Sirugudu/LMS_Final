import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import api from "../../../api/axios";
import StudentDashboardView from "./view";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [enrolledcount, setEnrolledCount] = useState(0);
  const [lastCourse, setLastCourse] = useState(null);
  const [assignmentsCount, setAssignmentsCount] = useState(0);

  const [studentName, setStudentName] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState([]); // NEW

  const [gamification, setGamification] = useState({
    xp: 0,
    rank: "Novice",
    streak: 0,
    progress: 0,
    nextLevelXP: 100,
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/student/dashboard");

        setEnrolledCount(res.data.enrolled_count);

        setGamification({
          xp: res.data.xp,
          streak: res.data.streak,
          rank:
            res.data.xp >= 500
              ? "Expert"
              : res.data.xp >= 200
                ? "Intermediate"
                : "Novice",
          progress: Math.min((res.data.xp / 500) * 100, 100),
          nextLevelXP: 500,
        });

        setLastCourse(res.data.last_learning || null);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchDashboard();
  }, []);

  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/me");
        setStudentName(res.data.name);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };

    fetchProfile();
  }, []);

  // Fetch Recommendations (Mock Logic)
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!auth.currentUser) return;
        const token = await auth.currentUser.getIdToken();
        const res = await api.get("/api/courses/explore", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mock Logic: If we assume user is Beginner, suggest Intermediate
        // In real app, check user's completed courses levels.
        const allCourses = res.data || [];
        const suggestions = allCourses
          .filter(c => c.level === 'Intermediate' || c.level === 'Advanced')
          .slice(0, 2);

        setRecommendedCourses(suggestions.length ? suggestions : allCourses.slice(0, 2));

      } catch (err) {
        console.error("Recommendations fetch failed:", err);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <StudentDashboardView
      navigate={navigate}
      enrolledCount={enrolledcount}
      lastCourse={lastCourse}
      assignmentsCount={assignmentsCount}
      studentName={studentName}

      gamification={gamification}
      recommendedCourses={recommendedCourses}
    />
  );
};

export default StudentDashboard;