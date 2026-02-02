import { BookOpen, Search, Filter, ArrowRight, Library, Star } from 'lucide-react';

const StudentCoursesView = ({
    loading,
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,
    selectedCategory, setSelectedCategory,
    selectedLevel, setSelectedLevel,
    displayCourses,
    enrolledIds,
    categories,
    handleEnroll,

    navigate,
    isFreeOnly,
    setIsFreeOnly
}) => {

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium text-sm">Loading catalog...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 font-sans text-primary-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900 tracking-tight">Course Library</h1>
                    <div className="flex gap-6 mt-4 flex-wrap">
                        {['my-learning', 'explore', 'free-courses', 'paid-courses', 'recommended', 'upcoming'].map(tab => (
                            <Tab
                                key={tab}
                                id={tab}
                                label={tab.replace('-', ' ')}
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-0 outline-none transition-all text-sm font-medium"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-3 py-2 rounded-md hover:border-indigo-500 transition-colors h-[38px] select-none">
                        <input
                            type="checkbox"
                            checked={isFreeOnly}
                            onChange={(e) => setIsFreeOnly(e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                        />
                        <span className="text-sm font-medium text-slate-700">Free Only</span>
                    </label>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select
                            className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 focus:border-indigo-500 outline-none cursor-pointer appearance-none min-w-[160px]"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <select
                        className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                        <option value="All">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {displayCourses.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-16 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 border border-slate-200">
                        <Library size={32} />
                    </div>
                    <h3 className="text-base font-bold text-primary-900 mb-1">No courses found</h3>
                    <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayCourses.map((courses) => {
                        const isEnrolled = enrolledIds.includes(courses.courses_id);
                        // Generate consistent rating 4.0 - 5.0 derived from UUID last char
                        const lastChar = parseInt(courses.courses_id.slice(-1), 16) || 0;
                        const rating = (4.0 + (lastChar % 10) / 10).toFixed(1);

                        return (
                            <div key={courses.courses_id} className="bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col h-full group overflow-hidden">
                                {/* Thumbnail */}
                                <div className="h-40 bg-slate-100 relative group-hover:bg-slate-50 transition-colors">
                                    <img
                                        src={`https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(courses.title.substring(0, 20))}`}
                                        alt={courses.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold uppercase tracking-wide text-slate-800">
                                        {courses.category}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                        {courses.level || 'General'}
                                    </div>
                                    <div className={`absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm ${courses.is_paid
                                        ? 'bg-amber-400 text-slate-900 border border-amber-500'
                                        : 'bg-emerald-500 text-white border border-emerald-600'
                                        }`}>
                                        {courses.is_paid ? `₹${courses.price}` : 'FREE'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="text-base font-bold text-primary-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                                        {courses.title}
                                    </h4>

                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold text-slate-700">{rating}</span>
                                        <span className="text-xs text-slate-400">(Students)</span>
                                    </div>

                                    <p className="text-xs text-slate-600 mb-4 font-bold flex items-center gap-1">
                                        By <span className="text-slate-800">{courses.instructor_name || 'Instructor'}</span>
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        {isEnrolled ? (
                                            <button
                                                className="btn-student-primary gap-2"
                                                onClick={() => navigate(`/student/course/${courses.courses_id}`)}
                                            >
                                                Resume <ArrowRight size={14} />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-student-secondary gap-2"
                                                onClick={() => handleEnroll(courses.courses_id)}
                                            >
                                                Enroll Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Tab = ({ id, label, activeTab, onClick }) => (
    <button
        className={`pb-2 text-sm font-bold transition-all relative capitalize ${activeTab === id
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-slate-500 hover:text-slate-800'
            }`}
        onClick={() => onClick(id)}
    >
        {label}
    </button>
);

export default StudentCoursesView;