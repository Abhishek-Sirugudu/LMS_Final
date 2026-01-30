import React, { useState, useEffect } from 'react';
import { UserCog, Save, Lock } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../auth/firebase';

const InstructorSettings = () => {
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        email: ''
    });
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.currentUser) {
            setProfile({
                displayName: auth.currentUser.displayName || 'Instructor Name',
                bio: 'This is a mock bio for frontend demo.',
                email: auth.currentUser.email
            });
            setLoading(false);
        }
    }, []);

    const handleProfileUpdate = async () => {
        try {
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match.");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, passwords.current);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, passwords.new);
            alert("Password changed successfully!");
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Failed to change password. check your current password.");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium animate-pulse">
            Loading settings...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] px-6 py-4 font-sans text-primary-900">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-primary-900 tracking-tight">Instructor Profile & Settings</h2>
                    <p className="text-slate-500 mt-1">Manage your public profile and account security.</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                        <UserCog className="text-indigo-600" size={18} />
                        <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wide">Public Profile</h4>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Display Name</label>
                                <input
                                    value={profile.displayName}
                                    onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Bio (Visible to students)</label>
                                <textarea
                                    rows="3"
                                    value={profile.bio}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                        <button className="btn-instructor-primary" onClick={handleProfileUpdate}>
                            <Save size={16} /> Save Profile
                        </button>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                        <Lock className="text-indigo-600" size={18} />
                        <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wide">Security</h4>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                        <button className="btn-instructor-secondary" onClick={handlePasswordChange}>
                            Change Password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InstructorSettings;
