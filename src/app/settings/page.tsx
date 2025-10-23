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

  // Add this helper function for dashboard routing
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

  // ... rest of your existing code (form states, useEffect, handlers, etc.)

  // In the JSX return, update the Dashboard link:
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

        {/* ... rest of your JSX */}
      </div>
    </div>
  );
};

export default SettingsPage;