"use client";

export default function DashboardOverview() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 mb-8">Welcome back to your cosmic command center.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Wallet Balance"
                    value="₹150.00"
                    icon="💰"
                    color="text-green-400 bg-green-400/10 border-green-400/20"
                />
                <StatCard
                    label="Total Consultations"
                    value="12"
                    icon="💬"
                    color="text-primary bg-primary/10 border-primary/20"
                />
                <StatCard
                    label="Saved Horoscopes"
                    value="4"
                    icon="📜"
                    color="text-purple-400 bg-purple-400/10 border-purple-400/20"
                />
            </div>

            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="glass rounded-2xl p-1 border border-glass-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Astrologer</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Type</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Cost</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {/* Mock Data */}
                        {[1, 2, 3].map((_, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white font-medium">Dr. Soniya</td>
                                <td className="p-4 text-gray-400">Chat</td>
                                <td className="p-4 text-gray-400">Oct 24, 2024</td>
                                <td className="p-4 text-white font-bold text-right">-₹50</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, icon, color }: any) => (
    <div className={`glass p-6 rounded-2xl border ${color.split(' ')[2]} flex items-center justify-between`}>
        <div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color.split(' ')[1]} ${color.split(' ')[0]}`}>
            {icon}
        </div>
    </div>
);
