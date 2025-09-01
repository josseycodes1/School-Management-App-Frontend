"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

interface StudentData {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  admission_number: string;
  phone: string;
  address: string;
  gender: string;
  blood_type: string;
  birth_date: string;
  photo: string | null; // Photo can be string or null
  class_level: string;
  attendance_rate?: number;
  grade?: string;
  lessons_count?: number;
  class_name?: string;
}

const SingleStudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const fetchStudentData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  if (!hasMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="bg-pink-100 border-l-4 border-josseypink1 p-4">
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
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p>No student data found</p>
      </div>
    );
  }

  const formattedBirthDate = student.birth_date
    ? new Date(student.birth_date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-josseypink1 py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={
                  student.photo
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${student.photo}`
                    : "/avatar.png"
                }
                alt={`${student.user.first_name}'s profile`}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/avatar.png";
                }}
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">
                {student.user.first_name} {student.user.last_name}
              </h1>
              <p className="text-sm text-gray-500">
                {student.address || "No address provided"}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.blood_type || "N/A"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{formattedBirthDate}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.user.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {student.attendance_rate}%
                </h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.grade}</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {student.lessons_count}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class_name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-josseypink1 text-white"
              href={`/students/${id}/lessons`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-josseypink2 text-white"
              href={`/students/${id}/teachers`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-josseypink1 text-white"
              href={`/students/${id}/exams`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-josseypink2 text-white"
              href={`/students/${id}/assignments`}
            >
              Student&apos;s Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-josseypink1 text-white"
              href={`/students/${id}/results`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>

        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
