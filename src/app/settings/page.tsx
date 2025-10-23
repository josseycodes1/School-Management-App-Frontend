"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  // Form states
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    date_of_birth: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    assignment_alerts: true,
    grade_alerts: true,
    announcement_alerts: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'private',
    show_grades: true,
    show_attendance: false,
    contact_info_visibility: 'teachers'
  });

  // Safe dashboard route function
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if we're on client side before accessing localStorage
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/log-in');
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
        
        // Set profile form data
        setProfileData({
          first_name: profileRes.data.user.first_name || '',
          last_name: profileRes.data.user.last_name || '',
          email: profileRes.data.user.email || '',
          phone_number: profileRes.data.phone_number || '',
          address: profileRes.data.address || '',
          date_of_birth: profileRes.data.date_of_birth || ''
        });

        // TODO: Fetch actual notification and privacy settings from API
        // For now using defaults

      } catch (err) {
        console.error('Failed to load user data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPrivacySettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setPrivacySettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSettings = async (section: string) => {
    setSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/log-in');
        return;
      }

      // In a real application, you would make API calls to save the settings
      // For now, we'll simulate a successful save
      
      setTimeout(() => {
        setSaveMessage({ type: 'success', text: `${section} settings saved successfully!` });
        setSaving(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveMessage({ type: '', text: '' });
        }, 3000);
      }, 1000);

    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-josseypink1"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href={getDashboardRoute()} 
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

        {/* Settings Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-josseypink1 to-josseypink2 rounded-full flex items-center justify-center mr-4">
                    {userData?.profile_picture ? (
                      <img 
                        src={userData.profile_picture} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {userData?.user?.first_name?.[0]}{userData?.user?.last_name?.[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {userData?.user?.first_name} {userData?.user?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">{userRole}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'profile' ? 'bg-josseypink1 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>

                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'notifications' ? 'bg-josseypink1 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                  </button>

                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'privacy' ? 'bg-josseypink1 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy & Security
                  </button>

                  <button
                    onClick={() => setActiveTab('account')}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'account' ? 'bg-josseypink1 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {saveMessage.text && (
                <div className={`mb-6 p-4 rounded-lg ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {saveMessage.text}
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={profileData.phone_number}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="date_of_birth"
                        name="date_of_birth"
                        value={profileData.date_of_birth}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveSettings('Profile')}
                      disabled={saving}
                      className="bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-josseypink2 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive important updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="email_notifications"
                          checked={notificationSettings.email_notifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive browser notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="push_notifications"
                          checked={notificationSettings.push_notifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Assignment Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified about new assignments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="assignment_alerts"
                          checked={notificationSettings.assignment_alerts}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Grade Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified when new grades are posted</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="grade_alerts"
                          checked={notificationSettings.grade_alerts}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Announcement Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified about school announcements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="announcement_alerts"
                          checked={notificationSettings.announcement_alerts}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveSettings('Notification')}
                      disabled={saving}
                      className="bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-josseypink2 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <label htmlFor="profile_visibility" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Visibility
                      </label>
                      <select
                        id="profile_visibility"
                        name="profile_visibility"
                        value={privacySettings.profile_visibility}
                        onChange={handlePrivacyChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      >
                        <option value="public">Public (Anyone can see your profile)</option>
                        <option value="school">School (Only school members can see your profile)</option>
                        <option value="teachers">Teachers (Only teachers can see your profile)</option>
                        <option value="private">Private (Only you can see your profile)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Grades to Others</h3>
                        <p className="text-sm text-gray-600">Allow others to see your grades</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="show_grades"
                          checked={privacySettings.show_grades}
                          onChange={handlePrivacyChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Attendance</h3>
                        <p className="text-sm text-gray-600">Allow others to see your attendance record</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="show_attendance"
                          checked={privacySettings.show_attendance}
                          onChange={handlePrivacyChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="contact_info_visibility" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Information Visibility
                      </label>
                      <select
                        id="contact_info_visibility"
                        name="contact_info_visibility"
                        value={privacySettings.contact_info_visibility}
                        onChange={handlePrivacyChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                      >
                        <option value="everyone">Everyone (Anyone can see your contact info)</option>
                        <option value="school">School (Only school members can see your contact info)</option>
                        <option value="teachers">Teachers (Only teachers can see your contact info)</option>
                        <option value="none">None (No one can see your contact info)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveSettings('Privacy')}
                      disabled={saving}
                      className="bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-josseypink2 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-2">Change Password</h3>
                      <p className="text-sm text-blue-600 mb-3">Update your password to keep your account secure</p>
                      <button className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                        Change Password
                      </button>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-medium text-yellow-800 mb-2">Download Your Data</h3>
                      <p className="text-sm text-yellow-600 mb-3">Request a copy of all your personal data stored on our platform</p>
                      <button className="bg-white text-yellow-600 border border-yellow-200 px-4 py-2 rounded-lg text-sm hover:bg-yellow-50 transition-colors">
                        Request Data Export
                      </button>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-600 mb-3">Permanently delete your account and all associated data</p>
                      <button className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;