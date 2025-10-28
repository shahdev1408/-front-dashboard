"use client"; // Required for hooks

import { useState, useEffect, FormEvent } from "react";
// Import your API instance
import { api } from '@/lib/api';
// Import icons (ensure lucide-react is installed)
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Loader2, X, Download } from "lucide-react";

// Define the interface for Course data from your backend
// Match this to your backend's course.model.js
interface ICourse {
    _id: string;      // MongoDB ID
    title: string;
    category?: string; // Optional based on your model
    sme?: string;      // Optional based on your model
    duration?: string; // Optional based on your model
    modules?: number;  // Optional based on your model
    learners?: string[]; // Array of User IDs (learners enrolled)
    status: 'draft' | 'active' | 'archived'; // Match enum if defined in model
    // Add createdAt, updatedAt if needed from your backend timestamps:true
    createdAt?: string;
    updatedAt?: string;
}

// --- Add Course Dialog Component ---
// Remember to replace basic HTML elements with shadcn/ui components
// (Dialog, DialogTrigger, DialogContent, Input, Button, Label, Select etc.)
const AddCourseDialog = ({ isOpen, onClose, onCourseAdded }: { isOpen: boolean, onClose: () => void, onCourseAdded: () => void }) => {
    // State for form fields - Match backend model
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [sme, setSme] = useState('');
    const [duration, setDuration] = useState('');
    const [modules, setModules] = useState<number | ''>(''); // Use '' for empty number input
    // State for loading and errors within the dialog
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("AddCourseDialog: Attempting to add course:", { title, category, sme, duration, modules });

        try {
            // Prepare data matching backend model (ensure modules is a number or omitted if empty)
            const courseData = {
                title,
                // Only include optional fields if they have a value
                ...(category && { category }),
                ...(sme && { sme }),
                ...(duration && { duration }),
                ...(modules !== '' && { modules: Number(modules) }) // Convert to number if not empty
                // 'status' defaults to 'draft' in your backend model, so no need to send it
                // 'learners' is managed via enrollments, not during creation
            };

            // Call the backend POST /courses/add endpoint using your api instance
            // This automatically sends the auth token
            const response = await api.post('/courses/add', courseData);

            console.log("AddCourseDialog: API response received:", response.data);

            // Your simple backend returns "Course added!" on success (status 200/201)
            // It might also return an error string directly in the body with status 400
            if (response.status === 200 || response.status === 201) {
                 // Call the callback to signal success (parent will refetch)
                onCourseAdded(); // Signal parent to refetch
                // Reset form and close dialog
                setTitle('');
                setCategory('');
                setSme('');
                setDuration('');
                setModules('');
                onClose();
            } else {
                 // Handle potential non-2xx success statuses if your backend uses them differently
                setError(response.data.msg || response.data.Error || "Failed to add course: Unexpected server response.");
            }
        } catch (err: any) {
            console.error("AddCourseDialog: API call failed", err);
            // Extract error message from backend response if available (often in err.response.data)
            setError(err.response?.data?.Error || err.response?.data?.msg || "An error occurred. Please check the details and try again.");
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    if (!isOpen) return null;

    // Render the dialog (Replace with shadcn/ui Dialog components)
    return (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
           {/* Replace with <Dialog> */}
           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-lg border border-gray-200 dark:border-gray-700">
               {/* Replace with <DialogHeader>, <DialogTitle>, <DialogDescription> */}
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Create New Course</h2>
                 <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close dialog"> <X size={20} /> </button>
               </div>
               {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-2 rounded-md">{error}</p>}
               {/* Replace with <DialogContent> */}
               <form onSubmit={handleSubmit} className="space-y-4">
                 {/* Title */}
                 <div>
                    {/* Replace with <Label> */}
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                    {/* Replace with <Input> */}
                   <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                 </div>
                 {/* Category */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                   <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Development, Design" />
                 </div>
                 {/* SME */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SME (Subject Matter Expert)</label>
                   <input type="text" value={sme} onChange={(e) => setSme(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Prof. Michael Torres" />
                 </div>
                 {/* Duration */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                   <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., 8 weeks" />
                 </div>
                 {/* Modules */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Modules</label>
                   <input type="number" value={modules} onChange={(e) => setModules(e.target.value === '' ? '' : Number(e.target.value))} min="0" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                 </div>
                 {/* Buttons */}
                 {/* Replace with <DialogFooter> */}
                 <div className="flex justify-end gap-3 pt-4">
                    {/* Replace with <Button variant="outline"> */}
                   <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                    {/* Replace with <Button> */}
                   <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center">
                     {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                     {loading ? 'Creating...' : 'Create Course'}
                   </button>
                 </div>
               </form>
           </div>
           {/* End <DialogContent> */}
         </div>
         // End <Dialog>
    );
};


// --- Main Courses Page Component ---
export default function CoursesPage() {
    // State for the list of courses fetched from backend
    const [courses, setCourses] = useState<ICourse[]>([]);
    // State for loading indicator for the page/table
    const [loading, setLoading] = useState(true);
    // State for page-level errors
    const [error, setError] = useState<string | null>(null);
    // State to control the visibility of the Add Course dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // useEffect hook to fetch courses when the component mounts
    useEffect(() => {
        fetchCourses(); // Initial fetch
    }, []);

    // --- Function to Fetch Courses ---
    const fetchCourses = async () => {
        setLoading(true); // Indicate loading starts
        setError(null); // Clear previous errors
        console.log("CoursesPage: Fetching courses list...");
        try {
            // Call GET /courses using the api instance
            // This route is public in your simple backend
            const response = await api.get('/courses');
            console.log("CoursesPage: API response received:", response.data);
            if (Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                // If response is not an array, something is wrong
                setError("Received unexpected data format from server.");
                setCourses([]); // Reset to empty array
            }
        } catch (err: any) {
            console.error("CoursesPage: Failed to fetch courses list", err);
            // Extract error message from backend response if available
            setError(err.response?.data?.Error || err.response?.data?.msg || "Failed to load courses.");
            setCourses([]); // Reset to empty array on error
        } finally {
            setLoading(false); // Indicate loading finished
            console.log("CoursesPage: Fetch courses list attempt finished.");
        }
    };

    // --- Callback for Dialog ---
    // This function is called by AddCourseDialog upon successful creation
    const handleCourseAdded = () => {
        console.log("CoursesPage: New course added signal received, refetching list...");
        // Since the simple backend's add route doesn't return the new object,
        // we refetch the entire list to show the new course.
        fetchCourses();
    };

    // --- Render Logic ---

    // Render loading state only on initial load when courses are empty
    if (loading && courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 p-8">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        );
    }

     // Render error state if fetching failed and courses are empty
    if (error && courses.length === 0) {
        return (
             <div className="p-8 space-y-8">
                <div className="text-center text-red-600 dark:text-red-400 p-4 border border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-900/20 rounded-md">
                    <p>Error loading courses:</p>
                    <p>{error}</p>
                     <button onClick={fetchCourses} className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Retry
                     </button>
                </div>
            </div>
        );
    }

    // Render the main page content
    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Course Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and organize your learning content</p>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)} // Open the dialog
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus className="w-4 h-4" /> Create Course
                </button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        // Add onChange handler for search later
                    />
                </div>
                <div className="flex gap-2">
                    {/* Add onChange handlers for filtering later */}
                    <select className="border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="">All Categories</option>
                        <option>Design</option>
                        <option>Development</option>
                        <option>Business</option>
                        {/* Populate dynamically later */}
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        <option value="">All Status</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Archived</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-xl border dark:border-gray-800 relative">
                 {/* Loading overlay for table updates/refreshes */}
                 {loading && courses.length > 0 && (
                     <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex justify-center items-center z-10 rounded-xl">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                )}
                 {/* Display fetch error over the table if data was previously loaded */}
                 {error && courses.length > 0 && (
                      <div className="absolute inset-x-0 top-0 p-2 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 z-10">
                         {error} <button onClick={fetchCourses} className="ml-2 underline text-xs">Retry</button>
                     </div>
                 )}
                <table className="w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-left">
                        <tr>
                            <th className="p-4 font-semibold">Course Title</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">SME</th>
                            <th className="p-4 font-semibold">Duration</th>
                            <th className="p-4 font-semibold">Modules</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {courses.length === 0 && !loading ? (
                             <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    No courses found. Click 'Create Course' to add one.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{course.title}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{course.category || '-'}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{course.sme || '-'}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{course.duration || '-'}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{course.modules ?? '-'}</td> {/* Use ?? for potential 0 or undefined */}
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                                                course.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                              : course.status === 'draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' // Archived or other
                                            }`}
                                        >
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            {/* Action buttons - Add onClick handlers later */}
                                            <button className="p-1 hover:text-blue-600" title="View Course"><Eye className="w-4 h-4" /></button>
                                            <button className="p-1 hover:text-green-600" title="Edit Course"><Edit className="w-4 h-4" /></button>
                                            <button className="p-1 hover:text-red-600" title="Delete Course"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Render the Add Course Dialog */}
            <AddCourseDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onCourseAdded={handleCourseAdded}
            />
        </div>
    );
}

