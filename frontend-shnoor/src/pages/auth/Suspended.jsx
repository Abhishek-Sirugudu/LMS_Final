import React from "react";
import { useNavigate } from "react-router-dom";
import { Ban, LogOut } from "lucide-react";
import { auth } from "../../auth/firebase";

const Suspended = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl p-8 text-center shadow-lg">
        <div className="w-[70px] h-[70px] rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5">
          <Ban size={28} />
        </div>

        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Account Suspended
        </h2>

        <p className="text-slate-500 leading-relaxed mb-2.5">
          Your account has been suspended by the administrator.
          <br />
          You no longer have access to the LMS.
        </p>

        <p className="text-sm text-slate-500 mb-6">
          Please contact support or the admin for further assistance.
        </p>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-xl border-none bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Suspended;
