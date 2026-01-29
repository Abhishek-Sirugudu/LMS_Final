import React, { useState } from "react";
import { Plus, Search, MoreVertical, Calendar, Trophy, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContestManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("active");

    // TODO: Backend integration to fetch instructor's contests
    const mockContests = [
        {
            id: 1,
            title: "Weekly Frontend Challenge: Dashboard UI",
            startTime: "Oct 25, 2024",
            endTime: "Oct 27, 2024",
            participants: 45,
            status: "active",
            prize: "$100",
        },
        {
            id: 2,
            title: "Algorithm Master: Array Manipulation",
            startTime: "Nov 02, 2024",
            endTime: "Nov 04, 2024",
            participants: 0,
            status: "scheduled",
            prize: "$50",
        },
        {
            id: 3,
            title: "Previous Challenge",
            startTime: "Oct 10, 2024",
            endTime: "Oct 12, 2024",
            participants: 120,
            status: "ended",
            prize: "$50",
        },
    ];

    const filtered = mockContests.filter((c) =>
        activeTab === "all" ? true : c.status === activeTab
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">Manage Contests</h1>
                    <p className="text-slate-500 mt-1">Create and oversee weekly coding challenges.</p>
                </div>
                <button
                    onClick={() => navigate("/instructor/contests/create")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg hover:bg-primary-800 shadow-md transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Create Contest</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-6 overflow-x-auto">
                    {["active", "scheduled", "ended"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab
                                    ? "border-primary-900 text-primary-900"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab} Contests
                        </button>
                    ))}
                </div>
            </div>

            {/* Contest List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Contest Title</th>
                                    <th className="px-6 py-4">Dates</th>
                                    <th className="px-6 py-4">Participants</th>
                                    <th className="px-6 py-4">Prize</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((contest) => (
                                    <tr key={contest.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-primary-900">{contest.title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${contest.status === 'active' ? 'bg-green-500' : contest.status === 'ended' ? 'bg-slate-400' : 'bg-blue-500'}`}></span>
                                                {contest.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span>{contest.startTime}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-4 h-4 text-slate-400" />
                                                <span>{contest.participants}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{contest.prize}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="font-medium">No {activeTab} contests found</p>
                        <p className="text-sm">Get started by creating a new contest.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestManagement;
