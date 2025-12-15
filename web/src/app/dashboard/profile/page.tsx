"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    if (!user) return null;

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

            <div className="glass rounded-3xl p-8 border border-glass-border space-y-8">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary p-1">
                        <div className="w-full h-full bg-[#0D0B1E] rounded-full flex items-center justify-center text-4xl">
                            👤
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.first_name || "User"} {user.last_name || ""}</h2>
                        <p className="text-gray-400">Member since {new Date().getFullYear()}</p>
                    </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">Phone Number</label>
                        <input
                            type="text"
                            value={user.phone_number}
                            disabled
                            className="w-full bg-surface/30 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            defaultValue={user.email || ""}
                            placeholder="Add email"
                            className="w-full glass-input rounded-xl px-4 py-3 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">First Name</label>
                        <input
                            type="text"
                            defaultValue={user.first_name || ""}
                            placeholder="Enter Name"
                            className="w-full glass-input rounded-xl px-4 py-3 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">Last Name</label>
                        <input
                            type="text"
                            defaultValue={user.last_name || ""}
                            placeholder="Enter Name"
                            className="w-full glass-input rounded-xl px-4 py-3 text-white"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button
                        onClick={() => toast.success("Profile Updated (Demo)")}
                        className="px-8 py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-glow hover:scale-[1.02] transition-transform"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                <p className="text-gray-500 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-bold hover:bg-red-500/20">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
