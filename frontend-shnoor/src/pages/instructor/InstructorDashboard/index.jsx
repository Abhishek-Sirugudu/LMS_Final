import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../auth/firebase';
import api from '../../../api/axios';
import InstructorDashboardView from './view';

export const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myCourses: 0,
    totalStudents: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [userName] = useState('Instructor');
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/analytics/instructor");

        setStats({
          myCourses: Number(res.data.courses),
          totalStudents: Number(res.data.students),
          avgRating: Number(res.data.rating),
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchDashboardStats();
  }, []);


  return (
    <InstructorDashboardView
      loading={loading}
      userName={userName}
      stats={stats}
      navigate={navigate}
    />
  );
};

export default InstructorDashboard;
