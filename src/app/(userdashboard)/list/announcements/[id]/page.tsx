"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { isAdmin } from "@/lib/user-role";

type Audience = {
  student_first_name?: string | null;
  teacher_first_name?: string | null;
  parent_first_name?: string | null;
};

type Announcement = {
  id: number;
  title: string;
  message: string;
  start_date: string;
  end_date?: string;
  audiences: Audience[];
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
};

const AnnouncementDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if user can edit/delete (only admin)
  const canEditDelete = isAdmin();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No access token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Announcement detail response:", res.data);
        setAnnouncement(res.data);
      } catch (err: any) {
        console.error("❌ API Error:", err.response?.data || err.message);
        setError(
          err.response?.data?.detail ||
            "Failed to load announcement. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const handleSuccess = (
    updatedAnnouncement: Announcement,
    type: "update" | "delete"
  ) => {
    if (type === "update") {
      setAnnouncement(updatedAnnouncement);
    } else if (type === "delete") {
      router.push("/list/announcements");
    }
  };

  const formatAudience = (audiences: Audience[]) => {
    return [
      audiences.some((a) => a.student_first_name) ? "Students" : null,
      audiences.some((a) => a.teacher_first_name) ? "Teachers" : null,
      audiences.some((a) => a.parent_first_name) ? "Parents" : null,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-pink-100 border-l-4 border-josseypink1 p-4 mb-4">
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
        <Link 
          href="/list/announcements" 
          className="inline-block mt-3 text-josseypink1 hover:text-josseypink2 font-medium"
        >
          ← Back to Announcements
        </Link>
      </div>
    );

  if (!announcement)
    return (
      <div className="bg-pink-100 border-l-4 border-josseypink1 p-4 mb-4">
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
          Announcement not found
        </div>
        <Link 
          href="/list/announcements" 
          className="inline-block mt-3 text-josseypink1 hover:text-josseypink2 font-medium"
        >
          ← Back to Announcements
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/list/announcements" 
          className="inline-flex items-center text-josseypink1 hover:text-josseypink2 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Announcements
        </Link>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{announcement.title}</h1>
          
          {canEditDelete && (
            <div className="flex space-x-2">
              <FormModal
                table="announcement"
                type="update"
                data={announcement}
                onSuccess={(updatedAnnouncement) =>
                  handleSuccess(updatedAnnouncement, "update")
                }
                trigger={
                  <button className="flex items-center text-josseypink1 hover:text-josseypink2 bg-white border border-josseypink1 px-3 py-2 rounded-lg transition-colors">
                    <Image
                      src="/update.png"
                      alt="Edit"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    Edit
                  </button>
                }
              />
              <FormModal
                table="announcement"
                type="delete"
                id={announcement.id}
                onSuccess={() => handleSuccess(announcement, "delete")}
                trigger={
                  <button className="flex items-center text-red-600 hover:text-red-800 bg-white border border-red-300 px-3 py-2 rounded-lg transition-colors">
                    <Image
                      src="/delete.png"
                      alt="Delete"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    Delete
                  </button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Announcement Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 mr-2">Audience:</span>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-josseypink1 text-white">
              {formatAudience(announcement.audiences)}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 mr-2">Published:</span>
            <span className="text-sm text-gray-700">{formatDate(announcement.start_date)}</span>
          </div>
          
          {announcement.end_date && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">Expires:</span>
              <span className="text-sm text-gray-700">{formatDate(announcement.end_date)}</span>
            </div>
          )}
          
          {announcement.created_by && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">By:</span>
              <span className="text-sm text-gray-700">
                {announcement.created_by.first_name} {announcement.created_by.last_name}
              </span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="prose max-w-none mb-6">
          <div className="text-gray-700 whitespace-pre-line">
            {announcement.message}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Created: {formatDateTime(announcement.created_at)}
          </div>
          
          {announcement.updated_at !== announcement.created_at && (
            <div className="text-sm text-gray-500">
              Updated: {formatDateTime(announcement.updated_at)}
            </div>
          )}
        </div>
      </div>

      {/* Audience Details */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Target Audience</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcement.audiences.some(a => a.student_first_name) && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Students
              </h3>
              <ul className="text-sm text-gray-600">
                {announcement.audiences
                  .filter(a => a.student_first_name)
                  .map((audience, index) => (
                    <li key={index} className="truncate">
                      {audience.student_first_name}
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
          
          {announcement.audiences.some(a => a.teacher_first_name) && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Teachers
              </h3>
              <ul className="text-sm text-gray-600">
                {announcement.audiences
                  .filter(a => a.teacher_first_name)
                  .map((audience, index) => (
                    <li key={index} className="truncate">
                      {audience.teacher_first_name}
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
          
          {announcement.audiences.some(a => a.parent_first_name) && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Parents
              </h3>
              <ul className="text-sm text-gray-600">
                {announcement.audiences
                  .filter(a => a.parent_first_name)
                  .map((audience, index) => (
                    <li key={index} className="truncate">
                      {audience.parent_first_name}
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailPage;