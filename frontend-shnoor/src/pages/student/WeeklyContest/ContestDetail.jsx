import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    Trophy,
    AlertCircle,
    Users,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";
import api from "../../../api/axios";
import { toast } from "react-hot-toast"; // Added import
import Leaderboard from "../../../components/contest/Leaderboard";

const ContestDetail = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();

    // Backend integration: Contest details fetched from /api/contests/:id
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const res = await api.get(`/api/contests/${contestId}`);
                const c = res.data;
                // Backend fields might need mapping if snake_case
                setContest({
                    id: c.contest_id,
                    title: c.title,
                    description: c.description || "No description provided.",
                    startTime: new Date(c.start_time).toLocaleDateString(),
                    endTime: new Date(c.end_time).toLocaleDateString(),
                    status: c.is_active ? 'active' : 'ended',
                    participants: 0, // Placeholder
                    rules: [
                        "Use React and Tailwind CSS only.",
                        "No third-party UI libraries allowing (e.g. MUI, Chakra).",
                        "Submission must be deployed (Vercel/Netlify).",
                        "Source code must be public on GitHub.",
                        "Deadline is strict. No late submissions.",
                    ],
                });
            } catch (err) {
                console.error("Failed to fetch contest detail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContest();
        fetchContest();
    }, [contestId]);

    const handleJoin = async () => {
        try {
            await api.post(`/api/contests/${contestId}/join`);
            toast.success("Successfully joined the contest!");
            // Optionally refresh contest details or navigate
        } catch (err) {
            console.error("Failed to join contest", err);
            toast.error(err.response?.data?.message || "Failed to join contest");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!contest) return <div className="p-8 text-center text-slate-500">Contest not found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Back Button */}
            <button
                onClick={() => navigate("/student/contests")}
                className="flex items-center gap-2 text-slate-500 hover:text-primary-900 transition-colors font-medium"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Contests
            </button>

            {/* Hero Section */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-primary-900/5 p-8 border-b border-primary-900/10">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wide mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                Active Contest
                            </span>
                            <h1 className="text-3xl font-bold text-primary-900 mb-4">
                                {contest.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>Ends: {contest.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span>{contest.participants} Participants</span>
                                </div>

                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-3 md:min-w-[200px]">
                            <button 
                                onClick={handleJoin}
                                className="w-full py-3 px-6 bg-primary-900 text-white font-semibold rounded-lg hover:bg-primary-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Join Contest
                            </button>
                            <p className="text-xs text-center text-slate-500">
                                Ends in 2 days 14 hours
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {/* Description & Rules */}
                    <div className="md:col-span-2 p-8 space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-indigo-600" />
                                Challenge Overview
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {contest.description}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                Rules & Guidelines
                            </h3>
                            <ul className="space-y-3">
                                {contest.rules.map((rule, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300 mt-2"></span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="md:col-span-1 bg-slate-50/50">
                        <div className="p-6">
                            <Leaderboard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestDetail;
