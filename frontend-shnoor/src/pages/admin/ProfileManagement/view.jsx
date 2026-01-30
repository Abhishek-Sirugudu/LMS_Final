import React from 'react';
import { UserCircle, Settings, Globe, Shield } from 'lucide-react';

const AdminProfileManagementView = () => {
    return (
        <div className="p-6 h-full font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                        <UserCircle size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Profile & Platform Settings</h2>
                        <p className="text-sm font-medium text-slate-500">Manage your admin identity and system-wide preferences.</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="shrink-0 relative">
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-lg">
                                <UserCircle size={64} />
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm">
                                <Shield size={14} />
                            </div>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Super Admin</h3>
                            <p className="text-slate-500 font-medium mb-3">admin@shnoor.com</p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-100">
                                <Shield size={12} /> System Administrator
                            </span>
                        </div>
                        <div className="shrink-0">
                            <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-sm">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* General Preferences */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-1">General Preferences</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Timezone Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                    <Globe size={24} />
                                </div>
                                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">EDIT</button>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">Timezone & Region</h4>
                                <p className="text-sm text-slate-500 font-medium">Asia/Kolkata (GMT+5:30)</p>
                            </div>
                        </div>

                        {/* Branding Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                                    <Settings size={24} />
                                </div>
                                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">Has Updates</button>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">Default Branding</h4>
                                <p className="text-sm text-slate-500 font-medium">Shnoor LMS Theme (Navy Blue)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileManagementView;
