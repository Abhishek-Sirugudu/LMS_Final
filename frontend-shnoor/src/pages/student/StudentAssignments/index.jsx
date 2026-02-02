import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../api/axios';
import { auth } from '../../../auth/firebase';

const StudentAssignments = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null); // For submit modal
    const [submissionData, setSubmissionData] = useState({ textAnswer: '', fileUrl: '', file: null, uploadProgress: 0 });

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                if (!auth.currentUser) return;
                const token = await auth.currentUser.getIdToken();
                const res = await api.get(`/api/homework/course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssignments(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load assignments");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [courseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await auth.currentUser.getIdToken();
            await api.post(`/api/homework/${selectedAssignment.assignment_id}/submit`, submissionData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Submitted successfully!");
            // Refresh list to show submitted status
            setAssignments(prev => prev.map(a =>
                a.assignment_id === selectedAssignment.assignment_id
                    ? { ...a, status: 'submitted' }
                    : a
            ));
            setSelectedAssignment(null);
            setSubmissionData({ textAnswer: '', fileUrl: '' });
        } catch (err) {
            toast.error("Failed to submit");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
                </div>

                <div className="space-y-4">
                    {assignments.map(a => (
                        <div key={a.assignment_id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{a.title}</h3>
                                    <p className="text-slate-500 text-sm mt-1 mb-3">{a.description}</p>
                                    <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        <span>Due: {new Date(a.due_date).toLocaleDateString()}</span>
                                        <span>Max Marks: {a.max_marks}</span>
                                    </div>
                                </div>
                                <div>
                                    {a.status === 'graded' ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                                            <CheckCircle size={12} /> Graded
                                        </span>
                                    ) : a.status === 'submitted' ? (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Clock size={12} /> Submitted
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                {a.status !== 'graded' && (
                                    <button
                                        onClick={() => setSelectedAssignment(a)}
                                        className="text-indigo-600 font-bold hover:underline text-sm flex items-center gap-2"
                                    >
                                        {a.status === 'submitted' ? 'Resubmit Assignment' : 'Submit Assignment'} <Upload size={14} />
                                    </button>
                                )}
                                {a.status === 'graded' && (
                                    <button className="text-green-600 font-bold text-sm cursor-default">
                                        View Grade (Check Dashboard)
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {assignments.length === 0 && !loading && (
                        <div className="text-center py-12 text-slate-500">No assignments due.</div>
                    )}
                </div>
            </div>

            {/* Submission Modal */}
            {selectedAssignment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Submit: {selectedAssignment.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Answer Text</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg h-32 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                                    value={submissionData.textAnswer}
                                    onChange={e => setSubmissionData({ ...submissionData, textAnswer: e.target.value })}
                                    placeholder="Type your answer here..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Attach File</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setSubmissionData({ ...submissionData, file: file });
                                            }
                                        }}
                                    />
                                    <Upload className="text-slate-400 mb-2" size={24} />
                                    <p className="text-sm font-bold text-slate-600">
                                        {submissionData.file ? submissionData.file.name : "Click to upload file"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP (Max 10MB)</p>
                                </div>
                                {submissionData.uploadProgress > 0 && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                            <span>Uploading...</span>
                                            <span>{submissionData.uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                                            <div
                                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${submissionData.uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedAssignment(null);
                                        setSubmissionData({ textAnswer: '', fileUrl: '', file: null, uploadProgress: 0 });
                                    }}
                                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!submissionData.textAnswer && !submissionData.file}
                                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submissionData.uploadProgress > 0 && submissionData.uploadProgress < 100 ? 'Uploading...' : 'Submit Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAssignments;
