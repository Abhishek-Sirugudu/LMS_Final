import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import api from "../../../api/axios";
import AddCourseView from "./view";

export const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editCourseId = searchParams.get("edit");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
    level: "",
    customCategory: "",
    status: "draft",
    modules: [],
    validity_value: "",
    validity_unit: "days",
    scheduledDate: "",
    isPaid: false,
    price: "",
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
    type: "video",
    url: "",
    duration: "",
    notes: "",
    pdfUrl: "",
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [videoInputType, setVideoInputType] = useState("url");
  const [pdfInputType, setPdfInputType] = useState("url");

  useEffect(() => {
    if (location.state?.courseData) {
      const data = location.state.courseData;
      setCourseData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        thumbnail: data.thumbnail || "",
        level: data.level || "",
        status: data.status || "draft",
        modules: data.modules || [],
        customCategory: "",
        validity_value: data.validity_value || "",
        validity_unit: data.validity_unit || "days",
        scheduledDate: data.scheduled_at || "",
        isPaid: data.is_paid || false,
        price: data.price || "",
      });
    }
  }, [editCourseId, location.state]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      if (value === "custom") {
        setIsCustomCategory(true);
        setCourseData((p) => ({ ...p, category: "" }));
      } else {
        setIsCustomCategory(false);
        setCourseData((p) => ({ ...p, category: value }));
      }
    } else {
      setCourseData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModuleForm((p) => ({ ...p, [name]: value }));
  };

  const addModule = () => {
    if (!moduleForm.title || !moduleForm.url) return;

    setCourseData((p) => ({
      ...p,
      modules: [
        ...p.modules,
        {
          id: Date.now().toString(),
          ...moduleForm,
          duration: moduleForm.type === "pdf" ? 0 : moduleForm.duration || 0,
        },
      ],
    }));

    setModuleForm({
      title: "",
      type: "video",
      url: "",
      duration: "",
      notes: "",
      pdfUrl: "",
    });
  };

  const removeModule = (id) => {
    setCourseData((p) => ({
      ...p,
      modules: p.modules.filter((m) => m.id !== id),
    }));
  };

  const moveModule = (index, direction) => {
    setCourseData((p) => {
      const mods = [...p.modules];
      const target = index + direction;
      if (target < 0 || target >= mods.length) return p;
      const [moved] = mods.splice(index, 1);
      mods.splice(target, 0, moved);
      return { ...p, modules: mods };
    });
  };

  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("File too large (max 100MB)");
      return;
    }

    setUploading(true);
    setUploadProgress(10); // Start progress

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress or use axios onUploadProgress
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(interval);
      setUploadProgress(100);

      const realUrl = res.data.file_url;
      console.log(`Uploaded ${fieldName}:`, realUrl);

      setModuleForm((prev) => ({
        ...prev,
        [fieldName]: realUrl,
      }));

      // If it's the main thumbnail, update courseData too (logic slightly differs based on fieldName)
      if (fieldName === 'thumbnail') {
        setCourseData(prev => ({ ...prev, thumbnail: realUrl }));
      }

    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };


  const handleSubmit = async (statusOverride) => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();

      const finalCategory = isCustomCategory
        ? courseData.customCategory
        : courseData.category;

      const courseRes = await api.post(
        "/api/courses",
        {
          title: courseData.title,
          description: courseData.description,
          category: finalCategory,
          thumbnail_url: courseData.thumbnail || null,
          difficulty: courseData.level,
          status: statusOverride,
          validity_value: courseData.validity_value
            ? Number(courseData.validity_value)
            : null,
          validity_unit: courseData.validity_value
            ? courseData.validity_unit
            : null,
          scheduled_at: courseData.scheduledDate || null,
          is_paid: courseData.isPaid === true || courseData.isPaid === 'true',
          price: (courseData.isPaid === true || courseData.isPaid === 'true') && courseData.price ? Number(courseData.price) : 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const courseId = courseRes.data.course.courses_id;

      if (courseData.modules.length) {
        await api.post(
          "/api/modules",
          {
            courseId,
            modules: courseData.modules.map((m, i) => ({
              title: m.title,
              type: m.type,
              content_url: m.url,
              duration: m.duration || 0,
              order_index: i + 1,
            })),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      navigate("/instructor/dashboard");
    } catch (err) {
      console.error("Save course error:", err);
      alert("Failed to save course: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddCourseView
      step={step}
      setStep={setStep}
      loading={loading}
      courseData={courseData}
      moduleForm={moduleForm}
      isCustomCategory={isCustomCategory}
      uploadProgress={uploadProgress}
      uploading={uploading}
      videoInputType={videoInputType}
      pdfInputType={pdfInputType}
      setVideoInputType={setVideoInputType}
      setPdfInputType={setPdfInputType}
      handleCourseChange={handleCourseChange}
      handleModuleChange={handleModuleChange}
      handleFileUpload={handleFileUpload}
      addModule={addModule}
      removeModule={removeModule}
      moveModule={moveModule}
      handleSubmit={handleSubmit}
    />
  );
};

export default AddCourse;
