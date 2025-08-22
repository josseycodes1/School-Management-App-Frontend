// app/list/exams/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import { useRouter } from 'next/navigation';
import { role } from "@/lib/data";

type Exam = {
  id: string;
  title: string;
  subject: {
    id: string;
    name: string;
  } | null;
  grade: {
    id: string;
    name: string;
  } | null;
  teacher: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
    };
  } | null;
  exam_date: string;
  start_time?: string;
  end_time?: string;
};

const ExamListPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const fetchExams = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const res = await axios.get("http://localhost:8000/api/assessment/exams/", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setExams(res.data);
      } catch (err) {
        setError("Failed to load exams");
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      await axios.delete(`http://localhost:8000/api/assessment/exams/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setExams(exams.filter(e => e.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Delete failed");
      console.error("Error deleting exam:", err);
    }
  };

  const formatTimeRange = (exam: Exam) => {
    if (!exam.start_time && !exam.end_time) return "No time specified";
    
    const formatTime = (timeString: string) => {
      if (!timeString) return "";
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const start = formatTime(exam.start_time || "");
    const end = formatTime(exam.end_time || "");

    if (start && end) return `${start} - ${end}`;
    if (start) return `Starts at ${start}`;
    if (end) return `Ends at ${end}`;
    
    return "No time specified";
  };

  const filteredExams = exams.filter(exam => {
    const searchTermLower = searchTerm.toLowerCase();
    const title = exam.title?.toLowerCase() || "";
    const subjectName = exam.subject?.name?.toLowerCase() || "No subject";
    const teacherName = exam.teacher ? 
      `${exam.teacher.user.first_name} ${exam.teacher.user.last_name}`.toLowerCase() : 
      "No teacher";
    const timeRange = formatTimeRange(exam).toLowerCase();

    return (
      title.includes(searchTermLower) ||
      subjectName.includes(searchTermLower) ||
      teacherName.includes(searchTermLower) ||
      timeRange.includes(searchTermLower)
    );
  });

  if (!isMounted) return null;

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
    </div>
  );

  if (error) return (
    <div className="bg-pink-100 border-l-4 border-josseypink1 p-4 mb-4">
      <div className="flex items-center text-josseypink1">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <TableSearch 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search exams..."
            />
          </div>
          
          {(role === "admin" || role === "teacher") && (
            <FormModal 
              table="exam" 
              type="create" 
              onSuccess={(newExam) => setExams([...exams, newExam])}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {exam.title || "Untitled Exam"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.subject?.name || "No subject"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formatTimeRange(exam)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.teacher ? 
                      `${exam.teacher.user.first_name} ${exam.teacher.user.last_name}` : 
                      "No teacher"
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : "No date"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => router.push(`/list/exams/${exam.id}`)}
                        className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                      >
                        <Image 
                          src="/view.png" 
                          alt="View" 
                          width={16} 
                          height={16} 
                          className="w-4 h-4"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-icon.png';
                          }}
                        />
                      </button>
                      {(role === "admin" || role === "teacher") && (
                        <>
                          <FormModal
                            table="exam"
                            type="update"
                            data={exam}
                            onSuccess={(updatedExam) => 
                              setExams(exams.map(e => 
                                e.id === updatedExam.id ? updatedExam : e
                              ))
                            }
                            trigger={
                              <button className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded">
                                <Image 
                                  src="/update.png" 
                                  alt="Update" 
                                  width={16} 
                                  height={16} 
                                  className="w-4 h-4"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-icon.png';
                                  }}
                                />
                              </button>
                            }
                          />
                          <button 
                            onClick={() => setDeleteConfirm(exam.id)}
                            className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                          >
                            <Image 
                              src="/delete.png" 
                              alt="Delete" 
                              width={16} 
                              height={16} 
                              className="w-4 h-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-icon.png';
                              }}
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {exams.length === 0 ? "No exams found" : "No exams found matching your search"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this exam? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-josseypink1 text-white rounded-md hover:bg-josseypink2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamListPage;