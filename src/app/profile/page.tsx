"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define user types
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  is_active: boolean;
  date_joined: string;
}

interface Profile {
  id: number;
  user: User;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  profile_picture?: string;
}

interface StudentProfile extends Profile {
  grade?: string;
  class_name?: string;
  parent?: any;
}

interface TeacherProfile extends Profile {
  subject?: string;
  qualifications?: string;
  years_of_experience?: number;
}

interface ParentProfile extends Profile {
  children?: any[];
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }

        // First get user info to determine role
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const user = userRes.data;
        setUserRole(user.role);
        
        // Then fetch profile data based on role
        let profileUrl = '';
        if (user.role === 'student') {
          profileUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/me/`;
        } else if (user.role === 'teacher') {
          profileUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/me/`;
        } else if (user.role === 'parent') {
          profileUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/me/`;
        } else {
          throw new Error('Unknown user role');
        }

        const profileRes = await axios.get(profileUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setUserData(profileRes.data);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-josseypink1"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-josseypink2 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2 capitalize">
                {userRole} • {userData?.user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center text-josseypink1 hover:text-josseypink2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-josseypink1 to-josseypink2 rounded-full flex items-center justify-center mb-4">
                  {userData?.profile_picture ? (
                    <img 
                      src={userData.profile_picture} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-white font-bold">
                      {userData?.user?.first_name?.[0]}{userData?.user?.last_name?.[0]}
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  {userData?.user?.first_name} {userData?.user?.last_name}
                </h2>
                <p className="text-gray-600 capitalize mt-1">{userRole}</p>
                
                <div className="w-full mt-6 space-y-4">
                  <button className="w-full bg-josseypink1 text-white py-2 rounded-lg hover:bg-josseypink2 transition-colors">
                    Edit Profile
                  </button>
                  <button className="w-full border border-josseypink1 text-josseypink1 py-2 rounded-lg hover:bg-josseypink1 hover:text-white transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Information Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                  <p className="text-gray-900">{userData?.user?.first_name || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                  <p className="text-gray-900">{userData?.user?.last_name || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <p className="text-gray-900">{userData?.user?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                  <p className="text-gray-900">{userData?.user?.username}</p>
                </div>
                
                {userData?.phone_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <p className="text-gray-900">{userData.phone_number}</p>
                  </div>
                )}
                
                {userData?.date_of_birth && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                    <p className="text-gray-900">
                      {new Date(userData.date_of_birth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                {userData?.address && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <p className="text-gray-900">{userData.address}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Role-specific Information */}
            {userRole === 'student' && userData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5m-9 5l-9-5m9 5v-6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Academic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userData.grade && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Grade</label>
                      <p className="text-gray-900">{userData.grade}</p>
                    </div>
                  )}
                  
                  {userData.class_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Class</label>
                      <p className="text-gray-900">{userData.class_name}</p>
                    </div>
                  )}
                  
                  {userData.parent && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Parent/Guardian</label>
                      <p className="text-gray-900">
                        {userData.parent.user.first_name} {userData.parent.user.last_name}
                      </p>
                      {userData.parent.user.email && (
                        <p className="text-gray-600 text-sm mt-1">{userData.parent.user.email}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {userRole === 'teacher' && userData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5m-9 5l-9-5m9 5v-6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userData.subject && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                      <p className="text-gray-900">{userData.subject}</p>
                    </div>
                  )}
                  
                  {userData.qualifications && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Qualifications</label>
                      <p className="text-gray-900">{userData.qualifications}</p>
                    </div>
                  )}
                  
                  {userData.years_of_experience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Years of Experience</label>
                      <p className="text-gray-900">{userData.years_of_experience}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {userRole === 'parent' && userData?.children && userData.children.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Children</h2>
                </div>
                
                <div className="space-y-4">
                  {userData.children.map((child: any) => (
                    <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">
                        {child.user.first_name} {child.user.last_name}
                      </h3>
                      {child.grade && (
                        <p className="text-gray-600 text-sm mt-1">Grade: {child.grade}</p>
                      )}
                      {child.class_name && (
                        <p className="text-gray-600 text-sm">Class: {child.class_name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;