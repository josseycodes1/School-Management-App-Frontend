"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { role } from "@/lib/data";
import { useState, useEffect } from "react";

type Student = {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  admission_number: string;
  phone: string;
  address: string;
  class_level: string;
  gender?: string;
  profile_picture?: string;
  date_of_birth?: string;
  parent?: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  };
};

const StudentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canEditDelete = role === "admin";

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/accounts/students/${studentId}/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch student');
        }
        
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const getProfilePictureUrl = (url?: string) => {
    if (!url) return "/blueavatar.png";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-josseypink2 border-l-4 border-josseypink1 p-4 mb-4">
        <div className="flex items-center text-josseypink1">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8 text-gray-500">
        Student not found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-josseypink1 hover:text-josseypink2 transition-colors"
          >
            <Image src="/back.png" alt="Back" width={20} height={20} className="mr-2" />
            <span className="hidden md:inline">Back to Students</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Student Details</h1>
        </div>
        
        {canEditDelete && (
          <div className="flex space-x-2 w-full md:w-auto">
            <button 
              onClick={() => router.push(`/list/students/${student.id}/edit`)}
              className="flex-1 md:flex-none bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Image src="/update.png" alt="Edit" width={16} height={16} />
              <span>Edit</span>
            </button>
          </div>
        )}
      </div>

      {/* Student Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Image
                src={getProfilePictureUrl(student.profile_picture)}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-md"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {student.user.first_name} {student.user.last_name}
            </h2>
            <p className="text-gray-600 mb-2">{student.user.email}</p>
            <span className="px-3 py-1 bg-josseypink1 text-white text-sm font-semibold rounded-full">
              {student.class_level}
            </span>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image src="/user.png" alt="Personal" width={20} height={20} />
              Personal Information
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Student ID:</span>
                <span className="text-gray-900 font-semibold">{student.admission_number}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Gender:</span>
                <span className="text-gray-900">{student.gender || "N/A"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Date of Birth:</span>
                <span className="text-gray-900">{formatDate(student.date_of_birth)}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image src="/contact.png" alt="Contact" width={20} height={20} />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Phone:</span>
                <span className="text-gray-900">{student.phone || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 text-sm sm:text-base mb-1">Address:</span>
                <span className="text-gray-900 text-sm break-words">{student.address || "No address provided"}</span>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image src="/parent.png" alt="Parent" width={20} height={20} />
              Parent/Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.parent ? (
                <>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Parent Name:</span>
                      <span className="text-gray-900">{student.parent.user.first_name} {student.parent.user.last_name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Email:</span>
                      <span className="text-gray-900">{student.parent.user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Phone:</span>
                      <span className="text-gray-900">{student.parent.user.phone || "N/A"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 text-center text-gray-500 py-4">
                  No parent/guardian information available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile Friendly */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="bg-white border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Image src="/attendance.png" alt="Attendance" width={24} height={24} />
              <span className="text-sm font-medium text-gray-700">Attendance</span>
            </div>
          </button>
          <button className="bg-white border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Image src="/grades.png" alt="Grades" width={24} height={24} />
              <span className="text-sm font-medium text-gray-700">Grades</span>
            </div>
          </button>
          <button className="bg-white border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Image src="/timetable.png" alt="Timetable" width={24} height={24} />
              <span className="text-sm font-medium text-gray-700">Timetable</span>
            </div>
          </button>
          <button className="bg-white border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Image src="/message.png" alt="Message" width={24} height={24} />
              <span className="text-sm font-medium text-gray-700">Message</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;