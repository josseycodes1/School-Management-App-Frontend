"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";
import { useRouter } from "next/navigation";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";

type Audience = {
  student_first_name?: string | null;
  teacher_first_name?: string | null;
  parent_first_name?: string | null;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  start_date: string;
  audiences: Audience[];
};

const AnnouncementListPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Token being used:", token);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API raw response:", res.data);

        // Handle both paginated & non-paginated responses
        if (Array.isArray(res.data)) {
          setAnnouncements(res.data);
        } else if (res.data.results) {
          setAnnouncements(res.data.results);
        } else {
          setAnnouncements([]);
        }
      } catch (err: any) {
        console.error("API Error:", err.response?.data || err.message);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleSuccess = (
    updatedAnnouncement: Announcement,
    type: "create" | "update" | "delete"
  ) => {
    if (type === "create") {
      setAnnouncements([updatedAnnouncement, ...announcements]);
    } else if (type === "update") {
      setAnnouncements(
        announcements.map((a) =>
          a.id === updatedAnnouncement.id ? updatedAnnouncement : a
        )
      );
    } else if (type === "delete") {
      setAnnouncements(
        announcements.filter((a) => a.id !== updatedAnnouncement.id)
      );
    }
  };

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      announcement.message
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const formatAudience = (audiences: Audience[]) => {
    return [
      audiences.some((a) => a.student_first_name) ? "Students" : null,
      audiences.some((a) => a.teacher_first_name) ? "Teachers" : null,
      audiences.some((a) => a.parent_first_name) ? "Parents" : null,
    ]
      .filter(Boolean)
      .join(", ");
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
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Announcement Management
        </h1>
        <div className="flex items-center gap-4">
          <TableSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search announcements..."
          />
          {role === "admin" && (
            <FormModal
              table="announcement"
              type="create"
              onSuccess={(data) => handleSuccess(data, "create")}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {announcement.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {announcement.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-josseypink1 text-white">
                      {formatAudience(announcement.audiences)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(announcement.start_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/list/announcements/${announcement.id}`)
                        }
                        className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                      >
                        <Image
                          src="/view.png"
                          alt="View"
                          width={16}
                          height={16}
                        />
                      </button>
                      {role === "admin" && (
                        <>
                          <FormModal
                            table="announcement"
                            type="update"
                            data={announcement}
                            onSuccess={(updatedAnnouncement) =>
                              handleSuccess(updatedAnnouncement, "update")
                            }
                            trigger={
                              <button className="text-josseypink1 hover:text-josseypink2 bg-josseypink1 p-1">
                                <Image
                                  src="/update.png"
                                  alt="Update"
                                  width={16}
                                  height={16}
                                />
                              </button>
                            }
                          />
                          <FormModal
                            table="announcement"
                            type="delete"
                            id={announcement.id}
                            onSuccess={() =>
                              handleSuccess(announcement, "delete")
                            }
                            trigger={
                              <button className="text-josseypink1 hover:text-josseypink2 bg-josseypink1 p-1">
                                <Image
                                  src="/delete.png"
                                  alt="Delete"
                                  width={16}
                                  height={16}
                                />
                              </button>
                            }
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No announcements found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination />
      </div>
    </div>
  );
};

export default AnnouncementListPage;
