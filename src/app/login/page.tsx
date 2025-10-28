"use client"; // Required because we use hooks (useState, useAuth, useRouter)

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext'; // Adjust path if your context is elsewhere
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Example loading icon from lucide-react

const LoginPage = () => {
  // State for email, password, and error messages
  const [email, setEmail] = useState('test@example.com'); // Pre-fill for easier testing
  const [password, setPassword] = useState('password123'); // Pre-fill for easier testing
  const [error, setError] = useState('');

  // Get functions and state from your AuthContext
  const { login, loading, isAuthenticated, authLoading } = useAuth();
  const router = useRouter(); // Hook for navigation

  // --- Handle Form Submission ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors
    try {
      // Call the login function from AuthContext
      await login(email, password);
      // AuthContext's login function handles redirection on success (router.push('/'))
    } catch (err: any) {
      // If login fails, display the error message from AuthContext
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  // --- Loading States ---
  // Show a spinner while the AuthProvider is checking initial auth state (e.g., reading localStorage)
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // If the user is already authenticated (e.g., token found), redirect them away from login
  if (isAuthenticated) {
    router.push('/'); // Redirect to the main dashboard
    return null; // Render nothing while redirecting
  }

  // --- Render the Login Form ---
  // Replace the basic HTML structure below with your actual shadcn/ui components
  // (e.g., Card, Input, Button, Label) for proper styling.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            LearnHub Dashboard
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome back, please sign in.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-2 rounded-md">
              {error}
            </p>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input /* Replace with <Input /> from shadcn/ui */
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input /* Replace with <Input /> from shadcn/ui */
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button /* Replace with <Button /> from shadcn/ui */
              type="submit"
              disabled={loading} // Disable button while login is in progress
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

