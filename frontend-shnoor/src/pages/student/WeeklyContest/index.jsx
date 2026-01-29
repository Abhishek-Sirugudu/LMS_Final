import React, { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import ContestCard from "../../../components/contest/ContestCard";

const WeeklyContest = () => {
    const [activeTab, setActiveTab] = useState("active");
    const [searchQuery, setSearchQuery] = useState("");

    // TODO: Backend integration needed here to fetch contests
    const mockContests = [
        {
            id: 1,
            title: "Weekly Frontend Challenge: Dashboard UI",
            description:
                "Build a responsive analytics dashboard using React and Tailwind CSS. Focus on component reusability and data visualization.",
            startTime: "Oct 25, 2024",
            endTime: "Oct 27, 2024",
            status: "active",
            entryFee: 0,
        },
        {
            id: 2,
            title: "Algorithm Master: Array Manipulation",
            description:
                "Solve 5 complex algorithmic problems focused on array optimization and time complexity. Optimize your code for the best performance.",
            startTime: "Nov 02, 2024",
            endTime: "Nov 04, 2024",
            status: "upcoming",
            entryFee: 0,
        },
        {
            id: 3,
            title: "Fullstack Auth Implementation",
            description:
                "Implement a secure authentication flow using JWT. Include refresh tokens, password reset, and protected routes.",
            startTime: "Oct 15, 2024",
            endTime: "Oct 17, 2024",
            status: "ended",
            entryFee: 10,
        },
    ];

    const filteredContests = mockContests.filter((contest) => {
        const matchesTab = contest.status === activeTab;
        const matchesSearch = contest.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900 tracking-tight">
                        Weekly Contests
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Compete with peers, showcase your skills, and win rewards.
                    </p>
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {["active", "upcoming", "ended"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 ${activeTab === tab
                                ? "bg-primary-900 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search contests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all text-slate-600 placeholder:text-slate-400"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </button>
            </div>

            {/* Contest Grid */}
            {filteredContests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-primary-900 mb-1">
                        No contests found
                    </h3>
                    <p className="text-slate-500 text-sm max-w-md text-center">
                        There are no {activeTab} contests matching your search criteria at the moment.
                    </p>
                </div>
            )}
        </div>
    );
};

export default WeeklyContest;
