import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Mail,
} from "lucide-react";
import { auth } from "../../auth/firebase";
import api from "../../api/axios";

const StudentPerformance = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredStudents = students.filter((student) => {
    const studentName = student.student_name || "";
    const courseTitle = student.course_title || "";

    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await auth.currentUser.getIdToken(true);

        const res = await api.get("/api/analytics/instructor/students", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch enrolled students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium animate-pulse">
        Loading performance data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-4 font-sans text-primary-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <button onClick={() => navigate(-1)} className="mt-1 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-primary-900 tracking-tight">Student Performance</h2>
            <p className="text-slate-500 mt-1">Track progress and identify students who need help.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-l-4 border-l-blue-500 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Students</span>
              <div className="text-3xl font-bold text-primary-900 mt-1">{students.length}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-l-4 border-l-rose-500 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">At Risk</span>
              <div className="text-3xl font-bold text-rose-600 mt-1">
                {students.filter((s) => s.status === "At Risk").length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-l-4 border-l-emerald-500 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">High Performers</span>
              <div className="text-3xl font-bold text-emerald-600 mt-1">
                {students.filter((s) => s.status === "Excellent").length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wide">Enrolled Students</h3>
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                placeholder="Search student or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Avg. Quiz Score</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary-900 text-sm">
                          {student.student_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          ID: {student.student_id ? student.student_id.slice(0, 8) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.course_title}
                      </td>


                      {/* Progress */}
                      <td className="px-6 py-4">
                        <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${student.progress || 0}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{student.progress || 0}%</div>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span className="font-bold text-slate-700">{student.avg_score || 0}%</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${student.status === 'Excellent' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            student.status === 'At Risk' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                              'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                          {student.status || 'GOOD'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors"
                          onClick={() => navigate("/instructor/chat")}
                        >
                          <Mail size={12} /> Message
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 text-sm">
                      No enrolled students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;
