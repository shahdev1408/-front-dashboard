"use client"; // Required for hooks and localStorage access

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import axios from 'axios'; // Use raw axios for login, as interceptor isn't set up yet
import { useRouter } from 'next/navigation'; // Use App Router's router

// Define the shape of the user object returned by your
// SIMPLE backend's /users/login route
interface User {
  id: string; // The user's MongoDB _id
  name: string; // The user's firstName
  // Add other fields like lastName, email, role if your login route returns them
  // or if you plan to fetch them later from a /users/me endpoint
}

// Define the shape of the data and functions the context will provide
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>; // Function to call login API
  logout: () => void; // Function to clear user state and token
  loading: boolean; // Indicates if the login function is currently running
  authLoading: boolean; // Indicates if the initial auth check (on page load) is running
  isAuthenticated: boolean; // Simple boolean flag for logged-in status
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get the backend API URL from environment variables for the login call
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // For login function specifically
  const [authLoading, setAuthLoading] = useState(true); // For initial load check
  const router = useRouter(); // Hook to navigate programmatically

  // useEffect runs once when the app loads to check for existing login
  useEffect(() => {
    console.log("AuthProvider: Checking initial auth state...");
    const storedToken = localStorage.getItem('learnhub_token');
    const storedUser = localStorage.getItem('learnhub_user');

    if (storedToken) {
      console.log("AuthProvider: Found token in localStorage.");
      setToken(storedToken);
      if (storedUser) {
        try {
          // Attempt to parse the stored user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log("AuthProvider: Restored user session:", parsedUser);
        } catch (e) {
          console.error("AuthProvider: Failed to parse stored user, clearing storage.", e);
          // If parsing fails (e.g., corrupted data), clear invalid items
          localStorage.removeItem('learnhub_user');
          localStorage.removeItem('learnhub_token');
          setToken(null); // Ensure state is cleared too
        }
      } else {
        // If token exists but no user data, might indicate incomplete login/logout
        // Optionally, you could try fetching user data from a '/users/me' endpoint here
        console.warn("AuthProvider: Token found but no user data in localStorage.");
        // For simplicity now, we just proceed with the token
      }
    } else {
      console.log("AuthProvider: No token found in localStorage.");
    }
    // Finished initial check
    setAuthLoading(false);
    console.log("AuthProvider: Initial auth check complete.");
  }, []); // Empty dependency array means this runs only once on mount

  // --- Login Function ---
  const login = async (email: string, password: string) => {
    setLoading(true); // Start login loading indicator
    console.log("AuthProvider: Attempting login...");
    try {
      // Make the POST request to your SIMPLE backend's login endpoint
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      console.log("AuthProvider: Login API response received:", response.data);

      // Check if the response contains the expected token and user data
      if (response.data && response.data.token && response.data.user) {
        const { token: receivedToken, user: loggedInUser } = response.data;

        // Update state
        setUser(loggedInUser);
        setToken(receivedToken);

        // Store token and user data in localStorage for persistence
        localStorage.setItem('learnhub_user', JSON.stringify(loggedInUser));
        localStorage.setItem('learnhub_token', receivedToken);

        console.log("AuthProvider: Login successful, navigating to dashboard.");
        router.push('/'); // Navigate to the dashboard page on successful login
      } else {
        // Handle unexpected response structure from the backend
        console.error("AuthProvider: Invalid response structure from login API:", response.data);
        throw new Error('Login failed: Unexpected server response.');
      }

    } catch (error: any) {
      console.error('AuthProvider: Login API call failed:', error);
      // Extract the error message from the backend response if available, otherwise use a generic message
      const message = error.response?.data?.msg || 'Invalid email or password'; // Your simple backend uses 'msg'
      throw new Error(message); // Re-throw the error so the LoginPage can display it
    } finally {
      setLoading(false); // Stop login loading indicator regardless of success/failure
      console.log("AuthProvider: Login attempt finished.");
    }
  };

  // --- Logout Function ---
  const logout = () => {
    console.log("AuthProvider: Logging out...");
    // Clear state
    setUser(null);
    setToken(null);
    // Clear localStorage
    localStorage.removeItem('learnhub_user');
    localStorage.removeItem('learnhub_token');
    console.log("AuthProvider: Session cleared, navigating to login.");
    router.push('/login'); // Redirect to login page after logout
  };

  // Determine authentication status based on token presence
  const isAuthenticated = !!token;

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      token,
      loading, // Login loading state
      authLoading, // Initial check loading state
      isAuthenticated,
      login,
      logout,
    }),
    [user, token, loading, authLoading, isAuthenticated] // Dependencies for memoization
  );

  // Provide the context value to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily consume the AuthContext in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Ensure the hook is used within the AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

