import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import ContestCard from "../../../components/contest/ContestCard";
import api from "../../../api/axios";

const WeeklyContest = () => {
    const [activeTab, setActiveTab] = useState("active");
    const [searchQuery, setSearchQuery] = useState("");

    // Backend integration: Contests are fetched from /api/contests
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await api.get('/api/contests');
                // Transform if necessary or use directly
                const formatted = res.data.map(c => ({
                    id: c.contest_id,
                    title: c.title,
                    description: c.description,
                    startTime: new Date(c.start_time).toLocaleDateString(),
                    endTime: new Date(c.end_time).toLocaleDateString(),
                    status: c.is_active ? 'active' : 'ended', // Simplified status logic
                    entryFee: 0 // Default free for now
                }));
                setContests(formatted);
            } catch (err) {
                console.error("Failed to fetch contests", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const filteredContests = contests.filter((contest) => {
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
                {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </button> */}
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
