import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import api from "../api/axios"; // Keeps your existing axios path

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // We consolidate everything into 'userData' to match the database row
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);

          const res = await api.post(
            "/api/auth/login",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          // 3. Status Check (Critical for new DB)
          // The DB returns 'pending', 'active', or 'blocked'.
          // We must block access if not active.
          const dbStatus = res.data.user.status.toLowerCase();

          if (dbStatus === 'blocked' || dbStatus === 'pending') {
            throw new Error("Account is not active");
          }

          // 4. Save User Data (The Fix)
          // We save the UUID (user_id) so we can use it for course enrollment later
          setCurrentUser(user);
          setUserData({
            user_id: res.data.user.user_id, // <--- THIS IS THE KEY FIX
            role: res.data.user.role.toLowerCase(),
            status: dbStatus,
            full_name: user.displayName,
            email: user.email
          });

        } catch (error) {
          console.error("AuthContext backend sync failed:", error);

          // If the backend says "Blocked" (403), force logout from Firebase too
          if (error.response?.status === 403 || error.message === "Account is not active") {
            await signOut(auth);
            alert("Access Denied: Your account is pending approval or blocked.");
            // ProtectedRoute will handle redirect to /login
          }

          setCurrentUser(null);
          setUserData(null);
        }
      } else {
        // User logged out
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
  };

  const value = {
    currentUser,
    userData,
    userRole: userData?.role || null,
    userStatus: userData?.status || null,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}