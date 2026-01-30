import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import api from "../../../api/axios";
import StudentCoursesView from "./view";

const StudentCourses = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my-learning");
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedLevel, setSelectedLevel] = useState("All");
  const [isFreeOnly, setIsFreeOnly] = useState(false);

  const enrolledIds = myCourses.map(
    (c) => c.courses_id || c.id
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!auth.currentUser) return;

        setLoading(true);
        const token = await auth.currentUser.getIdToken(true);

        const [myRes, exploreRes] = await Promise.all([
          api.get("/api/student/my-courses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/courses/explore", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMyCourses(myRes.data || []);
        setAllCourses(exploreRes.data || []);

        // TODO: Backend Integration - Fetch recommended courses
        // api.get("/api/courses/recommended", {
        //   headers: { Authorization: `Bearer ${token}` },
        // }).then(res => setRecommendedCourses(res.data || []));

        // TODO: Backend Integration - Fetch upcoming courses
        // api.get("/api/courses/upcoming", {
        //   headers: { Authorization: `Bearer ${token}` },
        // }).then(res => setUpcomingCourses(res.data || []));

      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getDisplayCourses = () => {
    switch (activeTab) {
      case "my-learning":
        return myCourses;
      case "explore":
        return allCourses;
      case "free-courses":
        return allCourses.filter(c => c.is_paid === false || c.is_paid === 'false' || !c.is_paid);
      case "paid-courses":
        return allCourses.filter(c => c.is_paid === true || c.is_paid === 'true');
      case "recommended":
        return recommendedCourses;
      case "upcoming":
        return upcomingCourses;
      default:
        return allCourses;
    }
  };

  const displayCourses = getDisplayCourses();

  const filteredCourses = displayCourses.filter((course) => {
    const matchesSearch = course.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;

    const matchesPrice = isFreeOnly
      ? (course.is_paid === false || course.is_paid === 'false' || !course.is_paid)
      : true;

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const handleEnroll = async (courseId) => {
    try {
      const token = await auth.currentUser.getIdToken(true);

      await api.post(
        `/api/student/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const [myRes, exploreRes] = await Promise.all([
        api.get("/api/student/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/courses/explore", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMyCourses(myRes.data || []);
      setAllCourses(exploreRes.data || []);
      setActiveTab("my-learning");
    } catch (err) {
      console.error("Enroll failed:", err);
      alert("Failed to enroll.");
    }
  };

  const categories = [
    ...new Set(allCourses.map((c) => c.category).filter(Boolean)),
  ];

  return (
    <StudentCoursesView
      loading={loading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      displayCourses={filteredCourses}
      enrolledIds={enrolledIds}
      categories={categories}
      handleEnroll={handleEnroll}

      navigate={navigate}
      isFreeOnly={isFreeOnly}
      setIsFreeOnly={setIsFreeOnly}
    />
  );
};

export default StudentCourses;