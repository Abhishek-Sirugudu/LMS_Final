import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../../../auth/firebase";
import api from "../../../api/axios";
import ProfileSettingsView from "./view";

const ProfileSettings = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    bio: "",
    headline: "",
    linkedin: "",
    github: "",
    role: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  /* =========================
     FETCH PROFILE FROM BACKEND
  ========================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!auth.currentUser) return;

      const token = await auth.currentUser.getIdToken();

      const res = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData({
        displayName: res.data.displayName || auth.currentUser.displayName || "",
        email: res.data.email || auth.currentUser.email || "",
        role: res.data.role || "User",
        bio: res.data.bio || "",
        headline: res.data.headline || "",
        linkedin: res.data.linkedin || "",
        github: res.data.github || "",
        photoURL: res.data.photoURL || auth.currentUser.photoURL || "",
      });

      setPreviewUrl(res.data.photoURL || auth.currentUser.photoURL || "");
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORM CHANGE
  ========================= */
  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
     IMAGE UPLOAD (SIMULATED)
  ========================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create local preview URL
      const downloadURL = URL.createObjectURL(file);

      setPreviewUrl(downloadURL);
      setUserData((prev) => ({ ...prev, photoURL: downloadURL }));

      // Note: In a real app with storage, we would get the URL after upload.
      // Here we just save the updated URL to the user profile if possible, 
      // but typically we'd send the file to backend. 
      // For now, we just update the UI state.

    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     SAVE PROFILE TO BACKEND
  ========================= */
  const handleSave = async () => {
    if (!auth.currentUser) return;

    setSaving(true);

    try {
      const token = await auth.currentUser.getIdToken();

      await api.put(
        "/api/users/me",
        {
          displayName: userData.displayName,
          bio: userData.bio,
          headline: userData.headline,
          linkedin: userData.linkedin,
          github: userData.github,
          photoURL: userData.photoURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Sync Firebase Auth display name
      if (userData.displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: userData.displayName,
        });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSettingsView
      loading={loading}
      userData={userData}
      saving={saving}
      uploading={uploading}
      previewUrl={previewUrl}
      handleChange={handleChange}
      handleSave={handleSave}
      handleImageUpload={handleImageUpload}
    />
  );
};

export default ProfileSettings;
