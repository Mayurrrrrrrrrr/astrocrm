import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for API calls
import KundliForm from './components/kundli/KundliForm';
import { 
  Users, MessageSquare, Phone, IndianRupee, 
  Calendar, Clock, Star, Settings, LogOut, 
  Menu, X, Send, Video, Mic, FileText
} from 'lucide-react';
import ChatWindow from './components/chat/ChatWindow';
import VastuCompass from './components/maps/VastuCompass';
import VastuPage from './pages/VastuPage';
import Resources from './pages/Resources';
import PanchangWidget from './components/panchang/PanchangWidget';

// --- Mock Data (Still used for Chat/History until we build those APIs) ---
const RECENT_CHATS = [
  { id: 1, name: "Rahul Kumar", type: "chat", time: "10:00 AM", duration: "15 min", earnings: 300, status: "Completed", topic: "Career" },
  { id: 2, name: "Priya Singh", type: "call", time: "11:30 AM", duration: "10 min", earnings: 250, status: "Completed", topic: "Marriage" },
  { id: 3, name: "Amit Verma", type: "video", time: "12:15 PM", duration: "20 min", earnings: 800, status: "Completed", topic: "Vastu" },
];

const ACTIVE_CLIENT = {
  id: 101,
  name: "Sneha Gupta",
  dob: "1998-05-22",
  tob: "14:30",
  pob: "Mumbai, MH",
  problem: "Facing issues in job promotion and stress.",
  history: "Consulted 2 months ago for relationship issues."
};

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Users size={20} /> },
    { id: 'chat', label: 'Live Consult', icon: <MessageSquare size={20} /> },
    { id: 'kundli', label: 'Kundli', icon: <FileText size={20} /> },
    { id: 'resources', label: 'Resources', icon: <FileText size={20} /> },
    { id: 'history', label: 'History', icon: <Clock size={20} /> },
    { id: 'earnings', label: 'Earnings', icon: <IndianRupee size={20} /> },
    { id: 'vastu', label: 'Vastu', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Profile & Rates', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
          <Star className="fill-orange-500 text-orange-500" /> AstroCRM
        </h1>
        <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); toggleSidebar(); }}
            className={`w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-800 transition-colors ${activeTab === item.id ? 'bg-orange-600 text-white border-r-4 border-white' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      {icon}
    </div>
  </div>
);

const LiveConsultation = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Client Sneha Gupta joined the chat.' },
    { id: 2, sender: 'user', text: 'Namaste Pandit ji. I am worried about my job.' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', text: input }]);
    setInput('');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-4">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">SG</div>
            <div>
              <h3 className="font-bold text-slate-800">{ACTIVE_CLIENT.name}</h3>
              <span className="text-xs text-green-600 flex items-center gap-1">● Ongoing (04:32)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full"><Mic size={20} /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full"><Video size={20} /></button>
            <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600">End Session</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
              {msg.sender === 'system' ? (
                <span className="bg-slate-200 text-slate-600 text-xs py-1 px-3 rounded-full">{msg.text}</span>
              ) : (
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your prediction or remedy..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors">
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Kundli & CRM Side Panel */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700 flex items-center gap-2"><FileText size={18}/> Kundli & Notes</h3>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Birth Details */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Birth Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-xs text-slate-400 block">DOB</span>
                <span className="text-sm font-medium text-slate-700">{ACTIVE_CLIENT.dob}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-xs text-slate-400 block">Time</span>
                <span className="text-sm font-medium text-slate-700">{ACTIVE_CLIENT.tob}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100 col-span-2">
                <span className="text-xs text-slate-400 block">Place</span>
                <span className="text-sm font-medium text-slate-700">{ACTIVE_CLIENT.pob}</span>
              </div>
            </div>
          </div>

          {/* CRM History */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Past Interactions</h4>
            <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-yellow-800">
              <strong>Last Note:</strong> {ACTIVE_CLIENT.history}
            </div>
          </div>

          {/* Quick Remedies */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suggest Remedy</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-sm border border-slate-200 rounded hover:bg-orange-50 text-slate-600 hover:text-orange-600">Gemstone</button>
              <button className="p-2 text-sm border border-slate-200 rounded hover:bg-orange-50 text-slate-600 hover:text-orange-600">Mantra</button>
              <button className="p-2 text-sm border border-slate-200 rounded hover:bg-orange-50 text-slate-600 hover:text-orange-600">Pooja</button>
              <button className="p-2 text-sm border border-slate-200 rounded hover:bg-orange-50 text-slate-600 hover:text-orange-600">Donation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardHome = ({ astrologer }) => {
  const [isOnline, setIsOnline] = useState(astrologer?.is_online || false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/content/quote/today/')
        if (res.data && res.data.text) setQuote(res.data)
      } catch (e) {
        setQuote(null)
      }
    })()
  }, [])

  if (!astrologer) {
    return <div className="p-8 text-center">Loading Astrologer Profile...</div>;
  }

  return (
    <div className="space-y-6">
      {quote && (
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
          <p className="text-slate-800 text-sm">“{quote.text}”</p>
          <p className="text-slate-500 text-xs mt-1">— {quote.author_name || 'Unknown'}</p>
        </div>
      )}
      <PanchangWidget />
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome back, {astrologer.user.first_name || astrologer.user.username}!
          </h2>
          <p className="text-slate-500">
            Expertise: {astrologer.expertise} | Languages: {astrologer.languages}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
          <span className="text-sm font-medium text-slate-600">Status:</span>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${isOnline ? 'bg-green-500 text-white shadow-green-200 shadow-lg' : 'bg-slate-200 text-slate-500'}`}
          >
            {isOnline ? 'ONLINE (Taking Calls)' : 'OFFLINE'}
          </button>
        </div>
      </div>

      {/* Stat Cards - Now using Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Chat Rate" value={`₹${astrologer.chat_rate}/min`} icon={<MessageSquare className="text-green-600" size={24} />} color="bg-green-500" />
        <StatCard title="Total Consultations" value={astrologer.total_consultations} icon={<Phone className="text-blue-600" size={24} />} color="bg-blue-500" />
        <StatCard title="Call Rate" value={`₹${astrologer.call_rate}/min`} icon={<Phone className="text-orange-600" size={24} />} color="bg-orange-500" />
        <StatCard title="Rating" value={astrologer.rating} icon={<Star className="text-yellow-500 fill-yellow-500" size={24} />} color="bg-yellow-500" />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Recent Consultations</h3>
          <button className="text-sm text-orange-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Earning</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_CHATS.map((chat) => (
                <tr key={chat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{chat.name}</div>
                    <div className="text-xs text-slate-400">{chat.topic}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize
                      ${chat.type === 'video' ? 'bg-purple-100 text-purple-700' : chat.type === 'call' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}
                    `}>
                      {chat.type === 'video' ? <Video size={12}/> : chat.type === 'call' ? <Phone size={12}/> : <MessageSquare size={12}/>}
                      {chat.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{chat.duration}</td>
                  <td className="p-4 text-green-600 font-bold text-sm">+₹{chat.earnings}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [astrologerData, setAstrologerData] = useState(null);

  // --- 1. FETCH DATA FROM DJANGO BACKEND ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // We can use /api directly because of the proxy in vite.config.js
        const response = await axios.get('/api/accounts/demo-profile/');
        console.log("Data fetched from Django:", response.data);
        setAstrologerData(response.data);
      } catch (error) {
        console.error("Error connecting to Backend:", error);
      }
    };

    fetchProfile();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between">
          <button onClick={toggleSidebar} className="text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-orange-600">AstroCRM</span>
          <div className="w-6"></div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <DashboardHome astrologer={astrologerData} />}
          {activeTab === 'chat' && <ChatWindow roomName="demo" />}
          {activeTab === 'kundli' && <KundliForm />}
          {activeTab === 'resources' && <Resources />}
          {activeTab === 'history' && <div className="text-center p-10 text-slate-400">History Module Placeholder</div>}
          {activeTab === 'earnings' && <div className="text-center p-10 text-slate-400">Earnings Module Placeholder</div>}
          {activeTab === 'vastu' && <VastuPage />}
          {activeTab === 'settings' && <div className="text-center p-10 text-slate-400">Settings Module Placeholder</div>}
        </div>
      </main>
    </div>
  );
};

export default App;