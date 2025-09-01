"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const ClassDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchClass = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) throw new Error('No access token found');

          const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/classes/${id}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setClassData(res.data);
        } catch (err) {
          setError('Failed to load class details');
        } finally {
          setLoading(false);
        }
      };

      fetchClass();
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-josseypink1 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading class details...</p>
      </div>
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
        <Link 
          href="/list/classes" 
          className="inline-flex items-center bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-josseypink2 transition-colors"
        >
          Back to Classes
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/list/classes" 
            className="inline-flex items-center text-josseypink1 hover:text-josseypink2 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Classes
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
              <p className="text-gray-600 mt-2">Class ID: {classData.id}</p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Active
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-josseypink1 to-josseypink2 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Class Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Class Name</label>
                <p className="text-lg font-medium text-gray-900">{classData.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Created Date</label>
                <p className="text-gray-900">
                  {new Date(classData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Supervisor Card */}
          {classData.teacher && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Supervisor</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <p className="text-lg font-medium text-gray-900">
                    {classData.teacher.user.first_name} {classData.teacher.user.last_name}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-gray-900">{classData.teacher.user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Teacher
                  </span>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Contact Supervisor
              </button>
            </div>
          )}

          {/* No Supervisor Card */}
          {!classData.teacher && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Supervisor</h2>
              </div>
              
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-gray-600 mb-4">No supervisor assigned</p>
                <button className="bg-josseypink1 text-white px-4 py-2 rounded-lg hover:bg-josseypink2 transition-colors">
                  Assign Supervisor
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-medium">Attendance</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Grades</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Schedule</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="text-sm font-medium">Announce</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;