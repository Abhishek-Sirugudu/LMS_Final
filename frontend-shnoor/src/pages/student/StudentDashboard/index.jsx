import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import api from "../../../api/axios";
import StudentDashboardView from "./view";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [enrolledcount, setEnrolledCount] = useState(0);
  const [lastCourse, setLastCourse] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [gamification, setGamification] = useState({
    xp: 0,
    rank: "Novice",
    streak: 0,
    progress: 0,
    nextLevelXP: 100,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/analytics/student");

        setEnrolledCount(res.data.enrolled_count);

        // Process gamification
        const xp = res.data.xp || 0;
        let rank = "Novice";
        if (xp >= 1000) rank = "Master";
        else if (xp >= 500) rank = "Expert";
        else if (xp >= 200) rank = "Intermediate";

        setGamification({
          xp: xp,
          streak: res.data.streak || 0,
          rank: rank,
          progress: Math.min((xp / 1000) * 100, 100), // Assuming 1000 is max for progress bar
          nextLevelXP: 1000, // Placeholder
        });

        // Process Activity & Deadlines (Backend should return these)
        setRecentActivity(res.data.recent_activity || []);
        setDeadlines(res.data.upcoming_deadlines || []);

        // Ensure lastCourse has progress
        if (res.data.last_learning) {
          setLastCourse({
            ...res.data.last_learning,
            progress: res.data.last_learning.progress || 0
          });
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchDashboard();
  }, []);

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

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!auth.currentUser) return;
        const token = await auth.currentUser.getIdToken();
        const res = await api.get("/api/courses/explore", {
          headers: { Authorization: `Bearer ${token}` },
        });

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
      studentName={studentName}

      gamification={gamification}
      recommendedCourses={recommendedCourses}
      deadlines={deadlines}
      recentActivity={recentActivity}
    />
  );
};

export default StudentDashboard;