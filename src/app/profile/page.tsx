"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  admission_number?: string;
  class_level?: string;
}

interface Profile {
  id: number;
  user: User;
  class_level?: string;
  subjects?: string[];
  children?: any[];
  phone?: string;
  address?: string;
  birth_date?: string;
  admission_number?: string;
  parent_name?: string;
  parent_contact?: string;
  subject_specialization?: string;
  hire_date?: string;
  emergency_contact?: string;
  occupation?: string;
  photo?: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadProfileFromLocalStorage = () => {
      try {
        const userData = localStorage.getItem("user");
        const userRole = localStorage.getItem("role");
        const userProfile = localStorage.getItem("user_profile"); 
        
        console.log('🔍 Loading profile data...');
        console.log('User data:', userData);
        console.log('User role:', userRole);
        console.log('User profile:', userProfile);

        if (!userData) {
          setError("No user data found. Please log in again.");
          setLoading(false);
          return;
        }

        if (!userRole) {
          setError("User role not found. Please log in again.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        const profileFromStorage = userProfile ? JSON.parse(userProfile) : {};
        
        console.log('📊 Parsed profile data:', profileFromStorage);

        // Create a profile combining user data and stored profile data
        const profileData: Profile = {
          id: user.id,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            admission_number: user.admission_number || profileFromStorage.admission_number,
            class_level: user.class_level || profileFromStorage.class_level
          },
          // Use data from localStorage if available
          phone: profileFromStorage.phone || '',
          address: profileFromStorage.address || '',
          birth_date: profileFromStorage.birth_date || '',
          class_level: profileFromStorage.class_level || user.class_level || '',
          admission_number: profileFromStorage.admission_number || user.admission_number || '',
          parent_name: profileFromStorage.parent_name || '',
          parent_contact: profileFromStorage.parent_contact || '',
          subject_specialization: profileFromStorage.subject_specialization || '',
          hire_date: profileFromStorage.hire_date || '',
          emergency_contact: profileFromStorage.emergency_contact || '',
          occupation: profileFromStorage.occupation || '',
          photo: profileFromStorage.photo || '',
          subjects: profileFromStorage.subjects || [],
          children: profileFromStorage.children || []
        };

        console.log('✅ Final profile data to display:', profileData);
        setProfile(profileData);
        
      } catch (err: any) {
        console.error('❌ Profile load error:', err);
        setError("Failed to load profile from local storage. Please complete your profile setup.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileFromLocalStorage();
  }, []);

  const getDashboardRoute = () => {
    if (typeof window === 'undefined') return '/log-in';
    
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
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Helper to check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    if (typeof window === 'undefined') return false;
    
    const onboardingComplete = localStorage.getItem("onboarding_complete");
    return onboardingComplete === "true";
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
    const hasOnboarding = hasCompletedOnboarding();
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error ? "Profile Setup Required" : "Profile Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Please complete your profile setup to view your information."}
          </p>
          <div className="space-y-3">
            {!hasOnboarding && (
              <button
                onClick={() => {
                  const role = localStorage.getItem("role");
                  if (role) {
                    router.push(`/onboarding/${role}`);
                  } else {
                    router.push('/log-in');
                  }
                }}
                className="w-full bg-josseypink1 text-white px-4 py-3 rounded-lg hover:bg-josseypink2 transition-colors font-medium"
              >
                Complete Profile Setup
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
          
          {/* Onboarding reminder */}
          {!hasCompletedOnboarding() && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-700">
                  Your profile is incomplete.{" "}
                  <button
                    onClick={() => {
                      const role = localStorage.getItem("role");
                      if (role) {
                        router.push(`/onboarding/${role}`);
                      }
                    }}
                    className="underline font-medium hover:text-yellow-800"
                  >
                    Complete your profile setup
                  </button>{" "}
                  to access all features.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-josseypink1 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              {profile.photo ? (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white">
                  <img 
                    src={profile.photo} 
                    alt={`${profile.user.first_name} ${profile.user.last_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {profile.user.first_name?.[0]}{profile.user.last_name?.[0]}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.user.first_name} {profile.user.last_name}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-josseypink2 opacity-90 capitalize">{profile.user.role}</p>
                  {profile.user.admission_number && (
                    <>
                      <span>•</span>
                      <p className="text-josseypink2 opacity-90 font-mono">
                        {profile.user.admission_number}
                      </p>
                    </>
                  )}
                  {profile.user.class_level && (
                    <>
                      <span>•</span>
                      <p className="text-josseypink2 opacity-90">
                        {profile.user.class_level}
                      </p>
                    </>
                  )}
                </div>
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
                      <p className="text-gray-800 font-medium">{profile.phone || 'Not provided'}</p>
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
                      </svg>
                      Student Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Admission Number</label>
                        <p className="text-gray-800 font-medium font-mono">
                          {profile.admission_number || profile.user.admission_number || 'Not assigned'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Class Level</label>
                        <p className="text-gray-800 font-medium">
                          {profile.class_level || profile.user.class_level || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Date of Birth</label>
                        <p className="text-gray-800 font-medium">
                          {formatDate(profile.birth_date || '')}
                        </p>
                      </div>
                      {profile.parent_name && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 block">Parent/Guardian</label>
                          <p className="text-gray-800 font-medium">{profile.parent_name}</p>
                          <p className="text-sm text-gray-600">{profile.parent_contact}</p>
                        </div>
                      )}
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
                        <label className="text-sm font-medium text-gray-500 block">Subject Specialization</label>
                        <p className="text-gray-800 font-medium">{profile.subject_specialization || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Hire Date</label>
                        <p className="text-gray-800 font-medium">{formatDate(profile.hire_date || '')}</p>
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
                        <label className="text-sm font-medium text-gray-500 block">Occupation</label>
                        <p className="text-gray-800 font-medium">{profile.occupation || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 block">Emergency Contact</label>
                        <p className="text-gray-800 font-medium">{profile.emergency_contact || 'Not provided'}</p>
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
                      <label className="text-sm font-medium text-gray-500 block">Profile Status</label>
                      <p className={`font-medium ${hasCompletedOnboarding() ? 'text-green-600' : 'text-yellow-600'}`}>
                        {hasCompletedOnboarding() ? 'Complete' : 'Incomplete - Setup Required'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
              {!hasCompletedOnboarding() && (
                <button
                  onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role) {
                      router.push(`/onboarding/${role}`);
                    }
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Complete Profile Setup
                </button>
              )}
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