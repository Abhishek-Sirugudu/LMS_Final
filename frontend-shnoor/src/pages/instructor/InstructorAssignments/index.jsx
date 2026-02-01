import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, FileText, Trash2, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../api/axios';
import { auth } from '../../../auth/firebase';

const InstructorAssignments = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, [courseId]);

    const fetchAssignments = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const res = await api.get(`/api/homework/course/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssignments(res.data);
        } catch (err) {
            console.error("Failed to load assignments", err);
            toast.error("Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/instructor/courses')}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
                            <p className="text-slate-500 text-sm">Manage tasks for this course</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/instructor/course/${courseId}/assignments/new`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30"
                    >
                        <Plus size={18} /> Create Assignment
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading...</div>
                ) : assignments.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Assignments Yet</h3>
                        <p className="text-slate-500 mb-6">Create your first assignment to assess student progress.</p>
                        <button
                            onClick={() => navigate(`/instructor/course/${courseId}/assignments/new`)}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Create now
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {assignments.map(a => (
                            <div key={a.assignment_id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md flex justify-between items-center group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-1">{a.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} /> Due: {new Date(a.due_date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Users size={14} /> Max Marks: {a.max_marks}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate(`/instructor/assignment/${a.assignment_id}/submissions`)}
                                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors text-sm"
                                    >
                                        View Submissions
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorAssignments;
