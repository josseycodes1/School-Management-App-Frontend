"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";

type Exam = {
  id: string;
  title: string;
  subject: {
    id: string;
    name: string;
    code?: string;
  } | null;
  grade: {
    id: string;
    name: string;
    level?: string;
  } | null;
  teacher: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    phone?: string;
  } | null;
  exam_date: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  created_at: string;
  description?: string;
};

type Result = {
  id: string;
  student: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
    };
    admission_number: string;
  };
  marks_obtained: number;
  total_marks: number;
  grade: string;
  remarks?: string;
};

const ExamDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

       
        const examRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessment/exams/${examId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setExam(examRes.data);

      
        try {
          const resultsRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessment/results/?exam=${examId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setResults(resultsRes.data);
        } catch (err) {
          console.log("No results found for this exam");
          setResults([]);
        }
      } catch (err) {
        setError("Failed to load exam details");
        console.error("Error fetching exam:", err);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not specified";
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${mins} minute${mins > 1 ? 's' : ''}`;
  };

  const handleDeleteSuccess = () => {
    router.push("/list/exams");
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="bg-pink-100 border-l-4 border-josseypink1 p-4 mb-4">
          <div className="flex items-center text-josseypink1">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
        <Link
          href="/list/exams"
          className="text-josseypink1 hover:text-josseypink2 underline"
        >
          ← Back to Exams
        </Link>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Exam Not Found</h2>
          <p className="text-gray-600 mb-6">The requested exam could not be found.</p>
          <Link
            href="/list/exams"
            className="bg-josseypink1 text-white px-6 py-2 rounded-lg hover:bg-josseypink2"
          >
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Link
            href="/list/exams"
            className="text-josseypink1 hover:text-josseypink2 underline mb-2 inline-block"
          >
            ← Back to Exams
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
          <p className="text-gray-600">
            {exam.subject?.name || "No subject"} • {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : "No date"}
          </p>
        </div>

        <div className="flex gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal
                table="exam"
                type="update"
                data={exam}
                onSuccess={(updatedExam) => setExam(updatedExam)}
                className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg"
              />
              <FormModal
                table="exam"
                type="delete"
                id={exam.id}
                onSuccess={handleDeleteSuccess}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              />
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-josseypink1 text-josseypink1"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Exam Details
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "results"
                ? "border-josseypink1 text-josseypink1"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Results ({results.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Exam Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-gray-900">{exam.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900">{exam.subject?.name || "Not assigned"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Grade/Class</label>
                <p className="text-gray-900">{exam.grade?.name || "Not assigned"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Exam Date</label>
                <p className="text-gray-900">
                  {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : "Not scheduled"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Time</label>
                <p className="text-gray-900">
                  {exam.start_time && exam.end_time 
                    ? `${formatTime(exam.start_time)} - ${formatTime(exam.end_time)}`
                    : exam.start_time 
                    ? `Starts at ${formatTime(exam.start_time)}`
                    : exam.end_time
                    ? `Ends at ${formatTime(exam.end_time)}`
                    : "No time specified"
                  }
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-gray-900">
                  {exam.duration_minutes ? formatDuration(exam.duration_minutes) : "Not specified"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="text-gray-900">
                  {exam.teacher 
                    ? `${exam.teacher.user.first_name} ${exam.teacher.user.last_name}`
                    : "Unknown teacher"
                  }
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Created On</label>
                <p className="text-gray-900">
                  {exam.created_at ? new Date(exam.created_at).toLocaleDateString() : "Unknown date"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Teacher Information</h2>
            
            {exam.teacher ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">
                    {exam.teacher.user.first_name} {exam.teacher.user.last_name}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{exam.teacher.user.email}</p>
                </div>
                
                {exam.teacher.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{exam.teacher.phone}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No teacher information available</p>
            )}
          </div>

          {exam.description && (
            <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{exam.description}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "results" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Exam Results</h2>
            {results.length > 0 && (
              <button className="bg-josseypink1 text-white px-4 py-2 rounded-lg hover:bg-josseypink2">
                Export Results
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Image
                src="/no-results.png"
                alt="No results"
                width={100}
                height={100}
                className="mx-auto mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-icon.png';
                }}
              />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Results Yet</h3>
              <p className="text-gray-600 mb-4">No students have taken this exam yet.</p>
              <button className="bg-josseypink1 text-white px-4 py-2 rounded-lg hover:bg-josseypink2">
                Add Results
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.student.user.first_name} {result.student.user.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.student.admission_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.marks_obtained} / {result.total_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {result.remarks || "No remarks"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamDetailPage;