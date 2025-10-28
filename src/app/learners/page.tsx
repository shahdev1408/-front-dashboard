"use client"; // Required for hooks

import { useState, useEffect, FormEvent } from "react";
// Import your API instance
import { api } from '@/lib/api';
// Import icons (ensure lucide-react is installed)
import { Plus, Search, Download, Edit, Trash2, Eye, Loader2, X } from "lucide-react";

// Define the interface for Learner data from your backend
// Match this to your backend's user.model.js
interface ILearner {
    _id: string;      // MongoDB ID
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    // Add other fields your API might return if needed (e.g., createdAt)
}

// --- Add Learner Dialog Component ---
// Remember to replace basic HTML elements with shadcn/ui components
// (Dialog, DialogTrigger, DialogContent, Input, Button, Label, Select etc.)
const AddLearnerDialog = ({ isOpen, onClose, onLearnerAdded }: { isOpen: boolean, onClose: () => void, onLearnerAdded: (newLearner: ILearner) => void }) => {
    // State for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('learner'); // Default role
    // State for loading and errors within the dialog
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("AddLearnerDialog: Attempting to add learner:", { firstName, lastName, email, role }); // Don't log password

        try {
            // Call the backend POST /users endpoint using your api instance
            // This automatically sends the auth token
            const response = await api.post('/users', {
                firstName,
                lastName,
                email,
                password, // Send password to backend for hashing
                role
            });

            console.log("AddLearnerDialog: API response received:", response.data);

            // Check for successful creation (Status 201) and presence of user data
            if (response.status === 201 && response.data.user) {
                onLearnerAdded(response.data.user); // Pass the new learner data back to the parent
                // Reset form and close dialog
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setRole('learner');
                onClose();
            } else {
                // Handle cases where backend returns success=false or unexpected structure
                setError(response.data.msg || "Failed to add learner: Unexpected server response.");
            }
        } catch (err: any) {
            console.error("AddLearnerDialog: API call failed", err);
            // Extract error message from backend response if available
            setError(err.response?.data?.msg || "An error occurred. Please check the details and try again.");
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    if (!isOpen) return null;

    // Render the dialog (Use shadcn/ui Dialog components for better styling)
    return (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Add New Learner</h2>
                 <button
                   type="button"
                   onClick={onClose}
                   className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                   aria-label="Close dialog"
                 >
                   <X size={20} />
                 </button>
               </div>
               {error && (
                 <p className="text-red-500 dark:text-red-400 text-sm mb-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-2 rounded-md">
                   {error}
                 </p>
               )}
               <form onSubmit={handleSubmit} className="space-y-4">
                 {/* First Name Input */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                   <input
                     type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                     className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   />
                 </div>
                  {/* Last Name Input */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                   <input
                     type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   />
                 </div>
                  {/* Email Input */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                   <input
                     type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                     className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   />
                 </div>
                  {/* Password Input */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                   <input
                     type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                   />
                 </div>
                  {/* Role Select (Optional) */}
                 <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                         value={role} onChange={(e) => setRole(e.target.value)}
                         className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                         <option value="learner">Learner</option>
                         {/* Add other roles like 'instructor', 'admin' if needed */}
                      </select>
                 </div>
                 {/* Submit Button */}
                 <div className="flex justify-end gap-3 pt-4">
                   <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                     Cancel
                   </button>
                   <button
                     type="submit" disabled={loading}
                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                   >
                     {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                     {loading ? 'Adding...' : 'Add Learner'}
                   </button>
                 </div>
               </form>
             </div>
           </div>
    );
};


// --- Main Learners Page Component ---
export default function LearnersPage() {
    // State for the list of learners fetched from backend
    const [learners, setLearners] = useState<ILearner[]>([]);
    // State for loading indicator for the page/table
    const [loading, setLoading] = useState(true);
    // State for page-level errors (e.g., failed to fetch list)
    const [error, setError] = useState<string | null>(null);
    // State to control the visibility of the Add Learner dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // useEffect hook to fetch learners when the component mounts
    useEffect(() => {
        fetchLearners(); // Initial fetch
    }, []);

    // --- Function to Fetch Learners ---
    const fetchLearners = async () => {
        setLoading(true);
        setError(null);
        console.log("LearnersPage: Fetching learners list...");
        try {
            // Call GET /users using the api instance (sends token automatically)
            const response = await api.get('/users');
            console.log("LearnersPage: API response received:", response.data);
            if (Array.isArray(response.data)) {
                setLearners(response.data);
            } else {
                setError("Received unexpected data format from server.");
                setLearners([]);
            }
        } catch (err: any) {
            console.error("LearnersPage: Failed to fetch learners list", err);
            setError(err.response?.data?.msg || "Failed to load learners.");
            setLearners([]);
        } finally {
            setLoading(false);
            console.log("LearnersPage: Fetch learners list attempt finished.");
        }
    };

    // --- Callback for Dialog ---
    // This function is called by AddLearnerDialog upon successful creation
    const handleLearnerAdded = (newLearner: ILearner) => {
        console.log("LearnersPage: New learner added, updating state:", newLearner);
        // Add the newly created learner to the top of the list in the state
        // This updates the UI immediately without needing another fetch
        setLearners(prevLearners => [newLearner, ...prevLearners]);
    };

    // --- Render Logic ---

    // Render loading state only on initial load
    if (loading && learners.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 p-6">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        );
    }

    // Render error state if fetching failed
    if (error && learners.length === 0) {
        return (
             <div className="p-6 space-y-6">
                <div className="text-center text-red-600 dark:text-red-400 p-4 border border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-900/20 rounded-md">
                    <p>Error loading data:</p>
                    <p>{error}</p>
                     <button onClick={fetchLearners} className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Retry
                     </button>
                </div>
            </div>
        );
    }

    // Render the main page content
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-gray-800 dark:text-gray-100">Learner Directory</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and track learner progress</p>
                </div>
                <div className="flex gap-3">
                    <button className="border dark:border-gray-600 px-4 py-2 rounded-md flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsDialogOpen(true)} // Open the dialog
                        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Learner
                    </button>
                </div>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search learners..."
                        className="pl-10 w-full border rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <select className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow-sm relative">
                 {/* Loading overlay for table updates */}
                 {loading && learners.length > 0 && (
                     <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex justify-center items-center z-10 rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                )}
                <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <tr>
                            <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Learner</th>
                            <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                            {/* Removed dummy columns: Enrolled, Progress, Status */}
                            <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {learners.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    No learners found. Click 'Add Learner' to create one.
                                </td>
                            </tr>
                        ) : (
                            learners.map((learner) => (
                                <tr key={learner._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{learner.firstName} {learner.lastName}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{learner.email}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400 capitalize">{learner.role}</td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {/* Action buttons - Add onClick handlers later */}
                                            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="Edit Learner">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500" title="Delete Learner">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Render the Add Learner Dialog */}
            <AddLearnerDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onLearnerAdded={handleLearnerAdded}
            />
        </div>
    );
}

