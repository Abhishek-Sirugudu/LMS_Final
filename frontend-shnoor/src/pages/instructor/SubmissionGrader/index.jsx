import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../api/axios';
import { auth } from '../../../auth/firebase';

const SubmissionGrader = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [selectedSub, setSelectedSub] = useState(null); // For grading modal
    const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, [assignmentId]);

    const fetchSubmissions = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const res = await api.get(`/api/homework/${assignmentId}/submissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await auth.currentUser.getIdToken();
            await api.post(`/api/homework/submission/${selectedSub.submission_id}/grade`, gradeData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Graded successfully");
            setSubmissions(prev => prev.map(s =>
                s.submission_id === selectedSub.submission_id
                    ? { ...s, status: 'graded', grade: gradeData.grade, feedback: gradeData.feedback }
                    : s
            ));
            setSelectedSub(null);
            setGradeData({ grade: '', feedback: '' });
        } catch (err) {
            toast.error("Failed to submit grade");
        }
    };

    const openGradeModal = (sub) => {
        setSelectedSub(sub);
        setGradeData({ grade: sub.grade || '', feedback: sub.feedback || '' });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Student Submissions</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Submitted At</th>
                                <th className="px-6 py-4">Answer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {submissions.map(sub => (
                                <tr key={sub.submission_id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                                {sub.photo_url && <img src={sub.photo_url} alt={sub.full_name} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{sub.full_name}</div>
                                                <div className="text-xs text-slate-500">{sub.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(sub.submitted_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.file_url ? (
                                            <a href={sub.file_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 text-sm font-medium">
                                                View File <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="text-slate-500 italic text-sm">Text only</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.status === 'graded' ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold flex items-center w-fit gap-1">
                                                <CheckCircle size={10} /> Graded: {sub.grade}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold flex items-center w-fit gap-1">
                                                <Clock size={10} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openGradeModal(sub)}
                                            className="text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                                        >
                                            {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {submissions.length === 0 && !loading && (
                        <div className="p-8 text-center text-slate-500">No submissions yet.</div>
                    )}
                </div>
            </div>

            {/* Grading Modal */}
            {selectedSub && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Grade {selectedSub.full_name}</h3>

                        <div className="mb-4 bg-slate-50 p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
                            <span className="font-bold text-slate-700 block mb-1">Answer:</span>
                            {selectedSub.text_answer || <span className="italic text-slate-400">No text answer</span>}
                        </div>

                        <form onSubmit={handleGradeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Marks</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={gradeData.grade}
                                    onChange={e => setGradeData({ ...gradeData, grade: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Feedback</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg h-24"
                                    value={gradeData.feedback}
                                    onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })}
                                    placeholder="Good job..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSub(null)}
                                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                                >
                                    Save Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionGrader;
