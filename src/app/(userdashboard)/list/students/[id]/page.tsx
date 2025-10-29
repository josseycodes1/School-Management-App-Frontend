"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";

type Student = {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  admission_number: string;
  phone?: string;
  address?: string;
  gender?: string;
  blood_type?: string;
  birth_date?: string;
  profile_picture?: string;
  class_level: string;
  attendance_rate?: number;
  grade?: string;
  lessons_count?: number;
  class_name?: string;
};

const SingleStudentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/${id}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const studentData = {
          ...response.data,
          attendance_rate: response.data.attendance_rate || 90,
          grade: response.data.grade || "6th",
          lessons_count: response.data.lessons_count || 18,
          class_name: response.data.class_name || "6A",
        };

        setStudent(studentData);
      } catch (err) {
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-josseypink2 border-l-4 border-josseypink1 p-4 mb-4">
        <div className="flex items-center text-josseypink1">
          <svg
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      </div>
    );

  if (!student) return (
    <div className="text-center py-8 text-gray-500">
      Student not found
    </div>
  );

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
        
        {role === "admin" && (
          <div className="flex space-x-2 w-full md:w-auto">
            <FormModal
              table="student"
              type="update"
              data={student}
              onSuccess={(updatedStudent) => setStudent(updatedStudent)}
              trigger={
                <button className="flex-1 md:flex-none bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Image src="/update.png" alt="Edit" width={16} height={16} />
                  <span>Edit Student</span>
                </button>
              }
            />
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
                src={student.profile_picture || "/blueavatar.png"}
                alt={`${student.user.first_name} ${student.user.last_name}`}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-md object-cover"
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
                <span className="text-gray-900">
                  {student.birth_date ? new Date(student.birth_date).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Blood Type:</span>
                <span className="text-gray-900">{student.blood_type || "N/A"}</span>
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

          {/* Stats Cards - Responsive Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-josseypink2 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Image src="/singleAttendance.png" alt="Attendance" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{student.attendance_rate}%</h3>
                <p className="text-white text-opacity-90 text-sm">Attendance</p>
              </div>
            </div>
            <div className="bg-josseypink1 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Image src="/singleBranch.png" alt="Grade" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{student.grade}</h3>
                <p className="text-white text-opacity-90 text-sm">Grade</p>
              </div>
            </div>
            <div className="bg-josseypink1 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Image src="/singleLesson.png" alt="Lessons" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{student.lessons_count}</h3>
                <p className="text-white text-opacity-90 text-sm">Lessons</p>
              </div>
            </div>
            <div className="bg-josseypink2 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Image src="/singleClass.png" alt="Class" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{student.class_name}</h3>
                <p className="text-white text-opacity-90 text-sm">Class</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT - Calendar */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Student's Schedule</h2>
            <div className="h-[400px] md:h-[600px]">
              <BigCalendar />
            </div>
          </div>
        </div>

        {/* RIGHT - Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Shortcuts */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href={`/students/${id}/lessons`}
                className="bg-josseypink1 hover:bg-josseypink2 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/lesson.png" alt="Lessons" width={20} height={20} />
                <span className="text-sm font-medium">Lessons</span>
              </Link>
              <Link 
                href={`/students/${id}/teachers`}
                className="bg-josseypink2 hover:bg-josseypink1 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/teacher.png" alt="Teachers" width={20} height={20} />
                <span className="text-sm font-medium">Teachers</span>
              </Link>
              <Link 
                href={`/students/${id}/exams`}
                className="bg-josseypink1 hover:bg-josseypink2 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/exam.png" alt="Exams" width={20} height={20} />
                <span className="text-sm font-medium">Exams</span>
              </Link>
              <Link 
                href={`/students/${id}/assignments`}
                className="bg-josseypink2 hover:bg-josseypink1 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/assignment.png" alt="Assignments" width={20} height={20} />
                <span className="text-sm font-medium">Assignments</span>
              </Link>
              <Link 
                href={`/students/${id}/results`}
                className="bg-josseypink1 hover:bg-josseypink2 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/result.png" alt="Results" width={20} height={20} />
                <span className="text-sm font-medium">Results</span>
              </Link>
              <Link 
                href={`/students/${id}/attendance`}
                className="bg-josseypink2 hover:bg-josseypink1 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/attendance.png" alt="Attendance" width={20} height={20} />
                <span className="text-sm font-medium">Attendance</span>
              </Link>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <Performance />
          </div>

          {/* Announcements */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleStudentPage;