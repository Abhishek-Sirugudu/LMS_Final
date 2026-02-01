import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Calendar, FileText, Save, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../api/axios';
import { auth } from '../../../auth/firebase';

const AssignmentBuilder = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const token = await auth.currentUser.getIdToken();

            await api.post('/api/homework', {
                ...data,
                courseId,
                dueDate: new Date(data.dueDate).toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Assignment created successfully!");
            navigate(-1); // Go back to list
        } catch (err) {
            console.error(err);
            toast.error("Failed to create assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create Assignment</h1>
                        <p className="text-slate-500 text-sm">Add a new task for your students</p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Assignment Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("title", { required: "Title is required" })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
                                placeholder="e.g., Final Project Submission"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Instructions <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register("description", { required: "Description is required" })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 min-h-[150px] resize-y"
                                placeholder="Describe the task requirements..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} /> Due Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register("dueDate", { required: "Due Date is required" })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-600"
                                />
                                {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                            </div>

                            {/* Max Marks */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Award size={16} /> Max Marks
                                </label>
                                <input
                                    type="number"
                                    {...register("maxMarks", { value: 100, min: 1 })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : <><Save size={18} /> Create Assignment</>}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignmentBuilder;
