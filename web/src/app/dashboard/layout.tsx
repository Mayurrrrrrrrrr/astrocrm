"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/auth/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const menuItems = [
        { icon: "📊", label: "Overview", href: "/dashboard" },
        { icon: "💬", label: "Consultations", href: "/dashboard/consultations" },
        { icon: "📜", label: "My Kundlis", href: "/kundli" }, // Reusing the kundli module
        { icon: "❤️", label: "Favorites", href: "/astrologers?filter=favorites" },
        { icon: "⚙️", label: "Profile", href: "/dashboard/profile" },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-glass-border hidden lg:flex flex-col p-6 fixed h-full">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-glow">
                        ✦
                    </div>
                    <span className="text-xl font-bold text-white">AstroCRM</span>
                </div>

                <nav className="space-y-2 flex-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-primary/20 text-primary border border-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-glass-border pt-6">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-surface border border-glass-border flex items-center justify-center text-lg">
                            👤
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user.phone_number}</p>
                            <p className="text-xs text-gray-500">Free User</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            router.push("/auth/login");
                        }}
                        className="w-full py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 bg-gradient-to-br from-background via-background-secondary to-surface min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-glass-border flex lg:hidden justify-around py-3 pb-5 z-50">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-gray-400"}`}>
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-[10px] uppercase font-bold">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
