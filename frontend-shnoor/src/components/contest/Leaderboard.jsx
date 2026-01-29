import React from "react";
import { Medal, UserCircle } from "lucide-react";

const Leaderboard = ({ entries }) => {
    // Mock data if no entries provided
    const data = entries || [
        { rank: 1, name: "Sarah Johnson", points: 2850, avatar: null },
        { rank: 2, name: "Michael Chen", points: 2720, avatar: null },
        { rank: 3, name: "David Kim", points: 2680, avatar: null },
        { rank: 4, name: "Emma Wilson", points: 2450, avatar: null },
        { rank: 5, name: "James Rodriguez", points: 2300, avatar: null },
    ];

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return <Medal className="w-5 h-5 text-yellow-500" />;
            case 2:
                return <Medal className="w-5 h-5 text-slate-400" />;
            case 3:
                return <Medal className="w-5 h-5 text-amber-700" />;
            default:
                return <span className="text-sm font-bold text-slate-400">#{rank}</span>;
        }
    };

    const getRowStyle = (rank) => {
        switch (rank) {
            case 1:
                return "bg-yellow-50/50 border-yellow-100";
            case 2:
                return "bg-slate-50/50 border-slate-100";
            case 3:
                return "bg-amber-50/50 border-amber-100";
            default:
                return "bg-white border-transparent hover:bg-slate-50";
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-white">
                <h3 className="text-lg font-bold text-primary-900 flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-indigo-600" />
                    Top Performers
                </h3>
                <p className="text-sm text-slate-500 mt-1">Current standings for this contest</p>
            </div>

            <div className="divide-y divide-slate-100">
                {data.map((entry) => (
                    <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-4 transition-colors border-l-4 ${getRowStyle(
                            entry.rank
                        )} ${entry.rank <= 3 ? "border-l-current" : "border-l-transparent"}`}
                        style={{
                            borderLeftColor:
                                entry.rank === 1
                                    ? "#EAB308"
                                    : entry.rank === 2
                                        ? "#94A3B8"
                                        : entry.rank === 3
                                            ? "#B45309"
                                            : "transparent",
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 flex justify-center">{getRankBadge(entry.rank)}</div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                    {entry.avatar ? (
                                        <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-primary-900">{entry.name}</p>
                                    <p className="text-xs text-slate-500">Student</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="block text-lg font-bold text-indigo-600">{entry.points.toLocaleString()}</span>
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Points</span>
                        </div>
                    </div>
                ))}

                {data.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        <p>No participants yet. Be the first to join!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrophyIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default Leaderboard;
