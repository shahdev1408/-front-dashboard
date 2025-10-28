"use client";

import { useState, useEffect, FormEvent } from "react";
// Import your API instance
import { api } from '@/lib/api';
// Import icons
import { Plus, Search, Mail, Phone, MoreVertical, Edit, Trash2, Eye, Loader2, X } from "lucide-react";
// Import shadcn/ui components (assuming correct paths)
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // For notifications

// --- Interfaces for API Data ---
interface ISME {
    _id: string;
    userId: string; // ID of the linked User
    name: string; // Full name (we'll assume the backend provides this combined)
    expertise: string;
    email: string;
    phone: string; // Currently mocked on frontend
    bio: string; // Currently mocked on frontend
    courses: number; // Placeholder for courses taught/managed
    avatar: string; // Initials generated on fetch
    status: "Active" | "Inactive";
}

// --- Add SME Dialog Component ---
const AddSmeDialog = ({ open, setOpen, onSmeAdded }: { open: boolean, setOpen: (open: boolean) => void, onSmeAdded: () => void }) => {
    const [formData, setFormData] = useState({
        name: "",
        expertise: "",
        email: "",
        phone: "+1 (555) XXX-XXXX", // Set mock default phone
        bio: "",
        password: "", 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Split full name into first and last for backend
    const getNames = (fullName: string) => {
        const parts = fullName.split(/\s+/);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        return { firstName, lastName };
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const { firstName, lastName } = getNames(formData.name);

        try {
            // 1. Create the base User (required by your backend for Auth and login)
            const userResponse = await api.post('/users', {
                firstName: firstName,
                lastName: lastName,
                email: formData.email,
                password: formData.password,
                role: 'instructor' // Ensure user is created with instructor role
            });

            const newUserId = userResponse.data.user._id;

            // 2. Create the SME profile
            // NOTE: The simple backend SME model only stores userId, name, expertise, and email. 
            // We'll send phone and bio anyway, but they won't persist unless you update the backend model.
            const smeResponse = await api.post('/smes/add', {
                userId: newUserId,
                name: formData.name,
                expertise: formData.expertise,
                email: formData.email,
                phone: formData.phone, 
                bio: formData.bio,
            });

            toast.success("SME added successfully!", {
                description: `${formData.name} has been added to the system.`,
            });
            onSmeAdded(); // Signal parent to refetch
            setOpen(false); // Close dialog
            // Reset form
            setFormData({ name: "", expertise: "", email: "", phone: "+1 (555) XXX-XXXX", bio: "", password: "" }); 

        } catch (err: any) {
            console.error("SME creation failed:", err);
            // Handle errors from either the /users or /smes endpoint
            const msg = err.response?.data?.msg || err.response?.data?.Error || "Server error. Check required fields or if email is already in use.";
            setError(msg);
            toast.error("Failed to add SME", { description: msg, duration: 5000 });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="glass-card max-w-2xl dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle>Add Subject Matter Expert</DialogTitle>
                    <DialogDescription>
                        Enter SME details. A user account is created with the password provided.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/30 dark:text-red-300">{error}</div>}
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="e.g., Dr. Jane Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1.5 dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                        <Label htmlFor="expertise">Area of Expertise</Label>
                        <Input id="expertise" placeholder="e.g., Digital Marketing" value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} className="mt-1.5 dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="jane.smith@learnhub.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1.5 dark:bg-gray-700 dark:text-white" required />
                        </div>
                        <div>
                            <Label htmlFor="password">Temporary Password</Label> 
                            <Input id="password" type="password" placeholder="Min 6 characters" minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mt-1.5 dark:bg-gray-700 dark:text-white" required />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="bio">Biography</Label>
                        <Textarea id="bio" placeholder="Brief professional background and expertise..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="mt-1.5 min-h-[100px] dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="gradient-primary border-0" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            {loading ? 'Adding...' : 'Add SME'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// --- Main SME Management Component ---
export default function SMEManagementPage() {
    const [smes, setSmes] = useState<ISME[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Initial and refetch function
    const fetchSmes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the GET /smes API you built
            const response = await api.get('/smes'); 
            
            if (Array.isArray(response.data)) {
                // Map the fetched data to include initials (avatar) for the cards
                const formattedSmes = response.data.map((sme: any) => ({
                    ...sme,
                    courses: sme.activeCourses || 0, 
                    avatar: sme.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
                    status: sme.status === 'active' ? 'Active' : 'Inactive', // Format status
                    phone: '+1 (555) XXX-XXXX' // Mock phone as it's not in the simple SME model
                }));
                setSmes(formattedSmes);
            } else {
                setError("Unexpected data format received from server.");
            }
        } catch (err: any) {
            console.error("Failed to fetch SMEs:", err);
            setError(err.response?.data?.msg || "Failed to load SME data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSmes();
    }, []);

    // Function to handle refetch after an SME is added
    const handleSmeAdded = () => {
        setOpenDialog(false);
        fetchSmes(); // Refetch the entire list to ensure new SME shows up
        // toast success notification is handled inside AddSmeDialog
    };
    
    // --- Render Logic ---
    if (loading && smes.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">SME Management</h1>
                    <p className="text-muted-foreground">Manage Subject Matter Experts and their courses</p>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary border-0 hover:scale-105 transition-transform">
                            <Plus className="w-4 h-4 mr-2" />
                            Add SME
                        </Button>
                    </DialogTrigger>
                
                {/* Render the actual dialog (outside the Trigger) */}
                <AddSmeDialog open={openDialog} setOpen={setOpenDialog} onSmeAdded={handleSmeAdded} />
            </Dialog>
            </div>

            {error && (
                 <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/30 dark:text-red-300 flex justify-between items-center">
                    <p>{error}</p>
                    <Button onClick={fetchSmes} size="sm" variant="outline">Retry</Button>
                 </div>
            )}

            {/* SME Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {smes.length === 0 && !loading ? (
                    <div className="col-span-3 text-center text-gray-500 p-8 border rounded-xl">
                        No SMEs found. Click 'Add SME' to create one.
                    </div>
                ) : (
                    smes.map((sme) => (
                        <Card key={sme._id} className="glass-card p-6 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-md transition-transform">
                                    {sme.avatar}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="glass-card dark:bg-gray-800">
                                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Profile</DropdownMenuItem>
                                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500 dark:text-red-400"><Trash2 className="w-4 h-4 mr-2" /> Remove</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">{sme.name}</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{sme.expertise}</p>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{sme.bio || "No biography provided."}</p>

                                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{sme.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Phone className="w-4 h-4" />
                                        <span>{sme.phone}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700/50">
                                    <div>
                                        <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{sme.courses}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Active Courses</p>
                                    </div>
                                    <Badge className={`${sme.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200'}`}>
                                        {sme.status}
                                    </Badge>
                                </div>
                                <Button className="w-full gradient-primary border-0 mt-4 !py-3">
                                    Contact
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
            
            {/* SME Directory Table (Below cards) */}
            <Card className="glass-card p-6 dark:bg-gray-800">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">SME Directory Table</h2>
                {/* Search Input Placeholder */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search SMEs..." className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <tr className="text-left text-gray-600 dark:text-gray-400 uppercase text-xs">
                                <th className="p-3 font-semibold">Name</th>
                                <th className="p-3 font-semibold">Expertise</th>
                                <th className="p-3 font-semibold">Contact</th>
                                <th className="p-3 font-semibold">Courses</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {smes.length === 0 && !loading ? (
                                <tr><td colSpan={6} className="p-4 text-center text-gray-500 dark:text-gray-400">No SMEs found.</td></tr>
                            ) : (
                                smes.map((sme) => (
                                    <tr key={sme._id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                                                    {sme.avatar}
                                                </div>
                                                <span className="font-medium text-gray-800 dark:text-gray-100">{sme.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{sme.expertise}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{sme.email}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{sme.courses}</td>
                                        <td className="p-4">
                                            <Badge className={`${sme.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200'}`}>
                                                {sme.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="glass-card dark:bg-gray-800">
                                                    <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                                                    <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500 dark:text-red-400"><Trash2 className="w-4 h-4 mr-2" /> Remove</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
