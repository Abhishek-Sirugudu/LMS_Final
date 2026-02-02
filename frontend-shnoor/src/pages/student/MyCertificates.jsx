import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Trophy, Award, Lock, Download, Share2, Printer } from 'lucide-react';
import { auth } from '../../auth/firebase';
import api from '../../api/axios';

const MyCertificates = () => {
    const { studentName, xp } = useOutletContext();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!auth.currentUser) return;
            try {
                const token = await auth.currentUser.getIdToken(true);
                const res = await api.get("/api/gamification/certificates", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCertificates(res.data);
            } catch (error) {
                console.error("Error fetching certificates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-8">Loading achievements...</div>;

    if (selectedCert) {
        return (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 overflow-y-auto p-4 print:p-0 print:bg-white print:fixed print:inset-0">
                <style>{`
                    @media print {
                        .sidebar, .top-bar, .no-print { display: none !important; }
                        .dashboard-container { display: block !important; margin: 0 !important; padding: 0 !important; }
                        .main-content { margin: 0 !important; padding: 0 !important; }
                        @page { size: landscape; margin: 0; }
                    }
                `}</style>

                <div className="w-full max-w-4xl">
                    <div className="no-print mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                        <button onClick={() => setSelectedCert(null)} className="btn-student-secondary w-auto px-6">Back</button>
                        <button onClick={handlePrint} className="btn-student-primary w-auto px-6 flex items-center gap-2">
                            <Printer size={16} /> Print / Download PDF
                        </button>
                    </div>

                    <div className="bg-white w-full max-w-[800px] mx-auto aspect-[1.414/1] p-10 border-[10px] border-double border-primary-900 relative text-center text-slate-800 font-serif shadow-2xl print:shadow-none print:w-full print:h-full print:border-none">
                        <div className="border-2 border-primary-900 h-full p-8 flex flex-col justify-center items-center">
                            <h1 className="text-5xl text-primary-900 uppercase tracking-widest mb-2 font-bold">Certificate</h1>
                            <h2 className="text-2xl text-slate-600 font-normal mb-8">of Achievement</h2>

                            <p className="text-xl mb-2 italic">This is to certify that</p>
                            <h3 className="text-4xl border-b-2 border-slate-300 pb-2 mb-6 min-w-[400px] font-bold text-primary-900">
                                {studentName}
                            </h3>

                            <p className="text-xl mb-2 italic">has successfully completed the course</p>
                            <h3 className="text-3xl text-primary-900 mb-10 font-bold">{selectedCert.course}</h3>

                            <div className="flex justify-between w-[90%] mt-12">
                                <div className="text-center">
                                    <p className="border-t border-slate-900 pt-2 w-48 mx-auto font-medium">Date: {selectedCert.date}</p>
                                </div>
                                <div className="text-center opacity-70">
                                    <Award size={40} className="mx-auto text-primary-900 mb-1" />
                                    <p className="text-xs uppercase tracking-wider font-bold">SHNOOR Certified</p>
                                </div>
                                <div className="text-center">
                                    <p className="border-t border-slate-900 pt-2 w-48 mx-auto font-medium">Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="student-page-header mb-8">
                <h3 className="text-2xl font-bold text-primary-900">My Achievements</h3>

            </div>

            <h4 className="text-lg font-bold text-primary-900 mb-4">Course Certificates</h4>

            {certificates.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Award size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">You haven't earned any certificates yet.</p>
                    <p className="text-sm text-slate-400">Complete a course to get certified!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map(cert => (
                        <div key={cert.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-44 relative flex items-center justify-center p-6" style={{ backgroundColor: cert.previewColor }}>
                                <div className="text-center text-white">
                                    <Award size={48} className="mb-2 mx-auto text-yellow-300 drop-shadow-md" />
                                    <div className="font-serif text-xl tracking-widest font-bold">CERTIFICATE</div>
                                    <div className="text-xs opacity-90 mt-1 font-medium">View Details</div>
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer" onClick={() => setSelectedCert(cert)}></div>
                            </div>

                            <div className="p-5">
                                <h4 className="font-bold text-primary-900 mb-1 truncate">{cert.course}</h4>
                                <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-1">
                                    Issued on {cert.date}
                                </p>

                                <button
                                    className="btn-student-primary flex items-center justify-center gap-2"
                                    onClick={() => setSelectedCert(cert)}
                                >
                                    <Download size={16} /> View / Print
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
