// @ts-nocheck
"use client"; // Required for hooks

import { useState, useEffect } from "react";
// Import your API instance
import { api } from '@/lib/api';
// Import icons (ensure lucide-react is installed, and adjust path if needed)
import { Users, BookOpen, Award, TrendingUp, ChevronDown, MessageSquare, PlusCircle, UserCheck, Search, Bot, X, Send, Loader2, TrendingDown, Users2, Activity, CheckCircle2, AlertTriangle, Clock, UserX } from "lucide-react";
// Import Recharts components (ensure recharts is installed)
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// --- Interfaces for API Data (Match your backend responses) ---
interface IMetrics {
    totalLearners: number;
    activeCourses: number;
    completionRate: string; // Or number
    certificatesIssued: number;
}

interface ICoursePerformance {
    name: string;
    learners: number;
    completion: number;
}

interface IAtRiskLearner {
    _id?: string; // Add if your API provides it
    name: string;
    course: string; // Title from populated course
    progress: number;
    reason: string;
    // lastLogin?: string; // Add if you update backend to provide this
    avatar?: string; // Add if you generate this on frontend or fetch from backend
}

interface IActivity {
    _id: string; // MongoDB ID
    user_id: { // Populated user object
        _id: string;
        firstName: string;
        lastName: string;
        avatar_url?: string; // Optional avatar
    };
    action: string;
    course_id?: { // Populated course object (optional)
        _id: string;
        title: string;
    };
    timestamp: string; // Date string
}


// --- Reusable Components (Define or Import from '@/components/dashboard/...') ---

// Metric Card Component (Adjust icon mapping if needed)
const MetricCard = ({ title, value, icon: IconComponent, trend, trendUp }: { title: string; value: string | number; icon: React.ElementType; trend?: string; trendUp?: boolean; }) => (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-1">
        <div>
            <div className="flex flex-row justify-between items-start mb-2">
                 <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</h3>
                 <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-blue-600 dark:text-blue-400">
                    <IconComponent className="w-5 h-5" />
                 </div>
            </div>
             <p className="text-3xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mt-1">{value}</p>
        </div>
         {trend && (
             <span className={`text-xs font-medium ${trendUp ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"} flex items-center mt-2`}>
                 {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                 {trend}
             </span>
         )}
    </div>
);

// Card Wrapper
const Card = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
    <div className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm ${className}`}>
        {children}
    </div>
);

// Basic Button (Replace with shadcn Button)
const Button = ({ className = '', children, ...props }: any) => (
    <button
        className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 ${className}`}
        {...props}
    >
        {children}
    </button>
);

// Basic Badge (Replace with shadcn Badge)
const Badge = ({ className = '', children }: any) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
        {children}
    </span>
);

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-xl">
                <p className="font-bold text-gray-800 dark:text-gray-100 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={`item-${index}`} style={{ color: entry.color || entry.fill }} className="text-sm font-medium">
                        {`${entry.name}: ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- AI Chatbot Component (Kept Simple - Uses Mock Interaction) ---
const AIChatbot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you with your learning data today?' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSend = () => {
        if (input.trim() && !isThinking) {
            const userMessage = { sender: 'user', text: input };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            setIsThinking(true);

            // Mock bot response delay
            setTimeout(() => {
                // In a real app, you would call api.post('/chat', { message: input }) here
                const botResponse = { sender: 'bot', text: `Okay, looking into insights about "${userMessage.text}"... (This is a mock response)` };
                setMessages(prev => [...prev, botResponse]);
                setIsThinking(false);
            }, 1500);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100vw-2rem)] sm:w-96 h-[70vh] sm:h-[600px] z-50 animate-fade-in">
            <Card className="w-full h-full flex flex-col shadow-2xl border-gray-300 dark:border-gray-700">
                {/* Header */}
                <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">AI Assistant</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-4 h-4" />
                    </button>
                </header>
                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-800/30">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 text-sm ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
                                    <Bot className="w-3 h-3 text-white" />
                                </div>
                            )}
                            <p className={`max-w-[75%] p-2 px-3 rounded-lg shadow-sm ${msg.sender === 'user'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-none'
                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </p>
                        </div>
                    ))}
                    {isThinking && (
                         <div className="flex items-end gap-2 text-sm">
                             <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white" />
                            </div>
                            <p className="max-w-[75%] p-2 px-3 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none italic">
                                Thinking...
                            </p>
                        </div>
                    )}
                </div>
                {/* Input */}
                <footer className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about your data..."
                            className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            disabled={isThinking}
                        />
                        <button onClick={handleSend} disabled={isThinking} className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </footer>
            </Card>
        </div>
    );
};


// --- Main Dashboard Page Component ---
export default function DashboardPage() {
    // State for dashboard data fetched from API
    const [metrics, setMetrics] = useState<IMetrics | null>(null);
    const [coursePerf, setCoursePerf] = useState<ICoursePerformance[]>([]);
    const [atRisk, setAtRisk] = useState<IAtRiskLearner[]>([]);
    const [activities, setActivities] = useState<IActivity[]>([]); // State for activity feed

    // General loading and error states for the page
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for UI elements
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [timeFilter, setTimeFilter] = useState('Last 30 Days');
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Fetch all dashboard data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        console.log("DashboardPage: Fetching all dashboard data...");
        try {
            // Fetch all required data concurrently using Promise.all
            const [metricsRes, coursePerfRes, atRiskRes, activityRes] = await Promise.all([
                api.get('/analytics/metrics'),         // Calls GET http://localhost:5000/analytics/metrics
                api.get('/analytics/course-performance'), // Calls GET http://localhost:5000/analytics/course-performance
                api.get('/analytics/at-risk-learners'),  // Calls GET http://localhost:5000/analytics/at-risk-learners
                api.get('/activitylog')                 // Calls GET http://localhost:5000/activitylog
            ]);

            console.log("DashboardPage: All API responses received.");

            // Validate and set state for each data piece
            if (metricsRes.data && typeof metricsRes.data === 'object') {
                setMetrics(metricsRes.data);
            } else { throw new Error("Invalid metrics data format"); }

            if (Array.isArray(coursePerfRes.data)) {
                setCoursePerf(coursePerfRes.data);
            } else { throw new Error("Invalid course performance data format"); }

            if (Array.isArray(atRiskRes.data)) {
                // Add avatar initials based on name for display
                setAtRisk(atRiskRes.data.map(learner => ({
                    ...learner,
                    avatar: learner.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                })));
            } else { throw new Error("Invalid at-risk learners data format"); }

             if (Array.isArray(activityRes.data)) {
                setActivities(activityRes.data);
            } else { throw new Error("Invalid activity log data format"); }

        } catch (err: any) {
            console.error("DashboardPage: Failed to fetch dashboard data", err);
            setError(err.response?.data?.msg || err.message || "Failed to load dashboard data. Please try again.");
            // Reset states on error
            setMetrics(null);
            setCoursePerf([]);
            setAtRisk([]);
            setActivities([]);
        } finally {
            setLoading(false); // Stop loading indicator
            console.log("DashboardPage: Fetch data attempt finished.");
        }
    };


    // --- Render Loading State ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-10rem)] p-8"> {/* Adjust height based on layout */}
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            </div>
        );
    }

    // --- Render Error State ---
    if (error) {
        return (
             <div className="p-8 space-y-8">
                <div className="text-center text-red-600 dark:text-red-400 p-4 border border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-900/20 rounded-md">
                    <p className="font-semibold">Error loading dashboard:</p>
                    <p className="text-sm">{error}</p>
                     <button onClick={fetchDashboardData} className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Retry
                     </button>
                </div>
            </div>
        );
    }

    // --- Render Main Dashboard Content ---
    // Mock data for charts not yet connected to backend API
    const categoryDistributionData = [ { name: 'Development', value: 45 }, { name: 'Design', value: 25 }, { name: 'Business', value: 18 }, { name: 'Data Science', value: 12 } ];
    const smeDeliverablesData = [ { name: 'Dr. Sarah C.', completed: 8, inProgress: 4, open: 2 }, { name: 'Prof. M. T.', completed: 12, inProgress: 2, open: 1 }, { name: 'Emma W.', completed: 6, inProgress: 6, open: 5 }, { name: 'John D.', completed: 9, inProgress: 3, open: 3 } ];
    const countryData = [ { name: 'USA', learners: 1011 }, { name: 'India', learners: 76 }, { name: 'UK', learners: 105 }, { name: 'Germany', learners: 41 }, { name: 'Canada', learners: 29 }, { name: 'Australia', learners: 23 } ];
    const COLORS = ['#2DAFB9', '#0099FF', '#A855F7', '#F97316', '#F9A825', '#10B981']; // Use your chart colors

    // Helper function to format date/time for activity feed
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000; // years
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000; // months
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400; // days
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600; // hours
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60; // minutes
        if (interval > 1) return Math.floor(interval) + " min ago";
        return Math.floor(seconds) + " sec ago";
    };


    return (
        <div className="space-y-8 animate-fade-in">
            {/* HEADER */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Welcome back! Here's your command center.</p>
                </div>
                {/* Search / Quick Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                   {/* Search Input (replace with actual search component later) */}
                    <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                         <input
                           type="text"
                           placeholder="Search..."
                           className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                         />
                     </div>
                    {/* Quick Actions Dropdown */}
                    <div className="relative">
                        <Button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-1.5 shadow-sm"
                        >
                            Quick Actions <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </Button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 animate-fade-in overflow-hidden">
                                {/* Replace # with actual links or onClick handlers */}
                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                    <PlusCircle className="w-4 h-4 text-blue-500" /> Create New Course
                                </a>
                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                    <UserCheck className="w-4 h-4 text-green-500" /> Invite New Learner
                                </a>
                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                    <MessageSquare className="w-4 h-4 text-purple-500" /> Send Announcement
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* METRICS GRID - Now uses fetched data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Learners" value={metrics?.totalLearners ?? 0} icon={Users2} trend="12% vs last month" trendUp={true} />
                <MetricCard title="Active Courses" value={metrics?.activeCourses ?? 0} icon={BookOpen} trend="3 new this week" trendUp={true} />
                <MetricCard title="Completion Rate" value={`${metrics?.completionRate ?? 0}%`} icon={CheckCircle2} trend="5% decrease" trendUp={false} />
                <MetricCard title="Certificates Issued" value={metrics?.certificatesIssued ?? 0} icon={Award} trend="18% vs last month" trendUp={true} />
            </div>

            {/* ANALYTICS CHARTS SECTION */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Course Analytics</h2>
                    {/* Time Filter Dropdown */}
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                    </select>
                </div>
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Top Performing Courses - Real Data */}
                    <Card className="lg:col-span-3 p-4 md:p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Top Performing Courses</h3>
                        <div className="h-72"> {/* Fixed height for chart area */}
                             {coursePerf.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={coursePerf} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50}/>
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                                        <Legend wrapperStyle={{ fontSize: '12px' }}/>
                                        <Bar dataKey="learners" name="Learners" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="completion" name="Completion %" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                             ) : (
                                 <div className="flex items-center justify-center h-full text-gray-500">No course performance data available.</div>
                             )}
                        </div>
                    </Card>
                    {/* Category Distribution - Mock Data */}
                    <Card className="lg:col-span-2 p-4 md:p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Category Distribution</h3>
                         <div className="h-72 w-full"> {/* Fixed height for chart area */}
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryDistributionData} // Still using mock data
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={100}
                                        paddingAngle={3} dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                        fontSize={10}
                                    >
                                        {categoryDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>

            {/* GEOGRAPHIC & SME CHARTS - Using Mock Data */}
            {/* TODO: Create backend endpoints and fetch real data for these */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">SME Deliverables</h3>
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={smeDeliverablesData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false}/>
                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={80} fontSize={10} interval={0} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: '12px' }}/>
                                <Bar dataKey="completed" name="Completed" stackId="a" fill={COLORS[5]} />
                                <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={COLORS[2]} />
                                <Bar dataKey="open" name="Open" stackId="a" fill={COLORS[3]} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Global Learner Distribution</h3>
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false}/>
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                                <Bar dataKey="learners" name="Learners" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* ACTIONABLE WIDGETS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* At-Risk Learners Table - Real Data */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">At-Risk Learners</h2>
                    <Card className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-400">Course</th>
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-400">Progress</th>
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-400">Reason</th>
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {atRisk.length === 0 ? (
                                        <tr><td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">No at-risk learners found.</td></tr>
                                    ) : (
                                        atRisk.map((learner) => (
                                            <tr key={learner._id || learner.name} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="p-3 flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                                        {learner.avatar || '??'}
                                                    </div>
                                                    <span className="font-medium text-gray-800 dark:text-gray-100">{learner.name}</span>
                                                </td>
                                                 <td className="p-3 text-gray-600 dark:text-gray-400">{learner.course}</td>
                                                <td className="p-3 font-medium text-gray-700 dark:text-gray-200">{learner.progress}%</td>
                                                <td className="p-3">
                                                    <Badge className={
                                                        learner.reason === "Inactive" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/50"
                                                      : learner.reason === "Failed Quiz" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-700/50"
                                                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-700/50" // Low Progress or default
                                                    }>
                                                        {learner.reason}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    {/* Replace with shadcn Button variant="outline" size="sm" */}
                                                    <button className="px-2.5 py-1 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-md text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                                        Contact
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Recent Activity Feed - Real Data */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
                    <Card className="p-4 md:p-6 space-y-4 hover:shadow-lg transition-shadow max-h-[400px] overflow-y-auto">
                        {activities.length === 0 ? (
                             <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent activity.</p>
                        ) : (
                            activities.map((act) => (
                                <div key={act._id} className="flex items-start gap-3 pb-3 last:pb-0 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                    {/* Avatar */}
                                    <div className="mt-0.5 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                         {/* Use real avatar if available, otherwise initials */}
                                         {act.user_id?.avatar_url ? (
                                             <img src={act.user_id.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover"/>
                                         ) : (
                                             `${act.user_id?.firstName?.[0] ?? ''}${act.user_id?.lastName?.[0] ?? ''}`.toUpperCase()
                                         )}
                                    </div>
                                    {/* Activity Text */}
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
                                            <span className="font-semibold">{act.user_id?.firstName} {act.user_id?.lastName || ''}</span>{' '}
                                            {act.action}{' '}
                                            {act.course_id && <span className="font-semibold text-blue-600 dark:text-blue-400">{act.course_id.title}</span>}
                                            {act.description && !act.course_id && <span>{act.description}</span>} {/* Display description if no course */}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatTimeAgo(act.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </Card>
                </div>
            </div>

            {/* AI Chatbot */}
            <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {/* AI Chatbot Floating Button */}
            {!isChatOpen && (
                <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
                    <Button
                        onClick={() => setIsChatOpen(true)}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center"
                        aria-label="Open AI Assistant"
                    >
                        <Bot className="w-6 h-6 sm:w-8 sm:h-8" />
                    </Button>
                </div>
            )}
        </div>
    );
}
