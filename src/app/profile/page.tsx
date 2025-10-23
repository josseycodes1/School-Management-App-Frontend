"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Profile {
  id: number;
  user: User;
  grade_level?: string;
  subjects?: string[];
  children?: any[];
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  // Add other role-specific fields as needed
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userRole = localStorage.getItem("role");
        
        if (!token) {
          setError("No access token found. Please log in again.");
          setLoading(false);
          return;
        }

        if (!userRole) {
          setError("User role not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Construct endpoint based on user role
        let endpoint = '';
        switch (userRole) {
          case 'student':
            endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/me/`;
            break;
          case 'teacher':
            endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/me/`;
            break;
          case 'parent':
            endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/me/`;
            break;
          case 'admin':
            endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/me/`;
            break;
          default:
            setError(`Unknown user role: ${userRole}`);
            setLoading(false);
            return;
        }

        console.log(`Fetching profile from: ${endpoint}`);
        
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Profile data received:', response.data);
        setProfile(response.data);
        
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          // Clear invalid token
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
        } else if (err.response?.status === 404) {
          setError("Profile not found. Please complete your profile setup.");
        } else {
          setError(err.response?.data?.detail || err.response?.data?.message || "Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getDashboardRoute = () => {
    const userRole = localStorage.getItem("role");
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'student':
        return '/student';
      case 'teacher':
        return '/teacher';
      case 'parent':
        return '/parent';
      default:
        return '/log-in';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    const dashboardRoute = getDashboardRoute();
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error ? "Error Loading Profile" : "Profile Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load your profile information."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-josseypink1 text-white px-4 py-3 rounded-lg hover:bg-josseypink2 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push(dashboardRoute)}
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/log-in')}
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the actual profile content
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-josseypink1 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {profile.user.first_name?.[0]}{profile.user.last_name?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.user.first_name} {profile.user.last_name}
                </h2>
                <p className="text-josseypink2 opacity-90 capitalize">{profile.user.role}</p>
                <p className="text-sm opacity-80 mt-1">{profile.user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">First Name</label>
                      <p className="text-gray-800 font-medium">{profile.user.first_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">Last Name</label>
                      <p className="text-gray-800 font-medium">{profile.user.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">Email Address</label>
                      <p className="text-gray-800 font-medium">{profile.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">Role</label>
                      <p className="text-gray-800 font-medium capitalize">{profile.user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">Phone Number</label>
                      <p className="text-gray-800 font-medium">{profile.phone_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">Address</label>
                      <p className="text-gray-800 font-medium">{profile.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              <div className="space-y-6">
                {/* Student Information */}
                {profile.user.role === 'student' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                      </svg>
                      Student Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Grade Level</label>
                        <p className="text-gray-800 font-medium">{profile.grade_level || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Date of Birth</label>
                        <p className="text-gray-800 font-medium">{formatDate(profile.date_of_birth || '')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Teacher Information */}
                {profile.user.role === 'teacher' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Teacher Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Subjects</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.subjects && profile.subjects.length > 0 ? (
                            profile.subjects.map((subject, index) => (
                              <span key={index} className="px-2 py-1 bg-josseypink1 text-white text-xs rounded-full">
                                {subject}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-800 font-medium">No subjects assigned</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Parent Information */}
                {profile.user.role === 'parent' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Parent Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Children</label>
                        {profile.children && profile.children.length > 0 ? (
                          <div className="space-y-2">
                            {profile.children.map((child, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-800 font-medium">{child.name}</p>
                                <p className="text-sm text-gray-600">{child.grade_level}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-800 font-medium">No children linked</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* System Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">User ID</label>
                      <p className="text-gray-800 font-medium">{profile.user.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block">Profile ID</label>
                      <p className="text-gray-800 font-medium">{profile.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => router.push(getDashboardRoute())}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2 transition-colors font-medium"
              >
                Refresh Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;