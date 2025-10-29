"use client";
import { useEffect, useState } from "react";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type Teacher = {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  profile_picture?: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
  subject_specialization?: string;
};

const SingleTeacherPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        );

        setTeacher(response.data);
      } catch (err) {
        setError("Failed to load teacher data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
    </div>
  );

  if (error) return (
    <div className="bg-josseypink2 border-l-4 border-josseypink1 p-4 mb-4">
      <div className="flex items-center text-josseypink1">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    </div>
  );

  if (!teacher) return (
    <div className="text-center py-8 text-gray-500">
      Teacher not found
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
            <span className="hidden md:inline">Back to Teachers</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Teacher Details</h1>
        </div>
        
        {role === "admin" && (
          <div className="flex space-x-2 w-full md:w-auto">
            <FormModal
              table="teacher"
              type="update"
              data={teacher}
              onSuccess={(updatedTeacher) => setTeacher(updatedTeacher)}
              trigger={
                <button className="flex-1 md:flex-none bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Image src="/update.png" alt="Edit" width={16} height={16} />
                  <span>Edit Teacher</span>
                </button>
              }
            />
          </div>
        )}
      </div>

      {/* Teacher Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Image
                src={teacher.profile_picture || "/default-teacher.png"}
                alt={`${teacher.user.first_name} ${teacher.user.last_name}`}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {teacher.user.first_name} {teacher.user.last_name}
            </h2>
            <p className="text-gray-600 mb-2">{teacher.user.email}</p>
            <span className="px-3 py-1 bg-josseypink1 text-white text-sm font-semibold rounded-full">
              {teacher.subject_specialization || "Teacher"}
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
                <span className="font-medium text-gray-700 text-sm sm:text-base">Teacher ID:</span>
                <span className="text-gray-900 font-semibold">{teacher.id}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Gender:</span>
                <span className="text-gray-900">{teacher.gender || "N/A"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Date of Birth:</span>
                <span className="text-gray-900">
                  {teacher.birth_date ? new Date(teacher.birth_date).toLocaleDateString() : "N/A"}
                </span>
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
                <span className="text-gray-900">{teacher.phone_number || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 text-sm sm:text-base mb-1">Address:</span>
                <span className="text-gray-900 text-sm break-words">{teacher.address || "No address provided"}</span>
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
                <h3 className="text-xl font-bold text-white">90%</h3>
                <p className="text-white text-opacity-90 text-sm">Attendance</p>
              </div>
            </div>
            <div className="bg-josseypink1 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Image src="/singleBranch.png" alt="Branches" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">2</h3>
                <p className="text-white text-opacity-90 text-sm">Branches</p>
              </div>
            </div>
            <div className="bg-josseypink1 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Image src="/singleLesson.png" alt="Lessons" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">6</h3>
                <p className="text-white text-opacity-90 text-sm">Lessons</p>
              </div>
            </div>
            <div className="bg-josseypink2 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Image src="/singleClass.png" alt="Classes" width={24} height={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">6</h3>
                <p className="text-white text-opacity-90 text-sm">Classes</p>
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Teacher's Schedule</h2>
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
                href="/" 
                className="bg-josseypink1 hover:bg-josseypink2 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/class.png" alt="Classes" width={20} height={20} />
                <span className="text-sm font-medium">Classes</span>
              </Link>
              <Link 
                href="/" 
                className="bg-josseypink2 hover:bg-josseypink1 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/student.png" alt="Students" width={20} height={20} />
                <span className="text-sm font-medium">Students</span>
              </Link>
              <Link 
                href="/" 
                className="bg-josseypink1 hover:bg-josseypink2 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/lesson.png" alt="Lessons" width={20} height={20} />
                <span className="text-sm font-medium">Lessons</span>
              </Link>
              <Link 
                href="/" 
                className="bg-josseypink2 hover:bg-josseypink1 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/exam.png" alt="Exams" width={20} height={20} />
                <span className="text-sm font-medium">Exams</span>
              </Link>
              <Link 
                href="/" 
                className="bg-josseypink1 hover:bg-josseypink2 text-white p-3 rounded-lg text-center transition-colors flex flex-col items-center gap-2"
              >
                <Image src="/assignment.png" alt="Assignments" width={20} height={20} />
                <span className="text-sm font-medium">Assignments</span>
              </Link>
              <Link 
                href="/" 
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

export default SingleTeacherPage;