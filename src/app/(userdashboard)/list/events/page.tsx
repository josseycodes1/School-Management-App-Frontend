// app/list/events/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";
import { useRouter } from 'next/navigation';
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";

type Event = {
  id: number;
  title: string;
  class_name?: string;
  class?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
};

type PaginationInfo = {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  total_pages: number;
};

const EventListPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    current_page: 1,
    total_pages: 1
  });
  const router = useRouter();

  const fetchEvents = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search })
      });

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Handle both paginated and non-paginated responses
      if (res.data.results) {
        setEvents(res.data.results);
        setPagination({
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
          current_page: page,
          total_pages: Math.ceil(res.data.count / 10) // Assuming page_size = 10
        });
      } else {
        setEvents(Array.isArray(res.data) ? res.data : []);
        setPagination({
          count: Array.isArray(res.data) ? res.data.length : 0,
          next: null,
          previous: null,
          current_page: 1,
          total_pages: 1
        });
      }
    } catch (err) {
      setError("Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1, searchTerm);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    fetchEvents(page, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSuccess = (updatedEvent: Event, type: "create" | "update" | "delete") => {
    // Refresh the current page after mutation
    fetchEvents(pagination.current_page, searchTerm);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "—";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <div className="flex items-center gap-4">
          <TableSearch 
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search events..."
          />
          {role === "admin" && (
            <FormModal 
              table="event" 
              type="create"
              onSuccess={(data) => handleSuccess(data, "create")}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {events.length} of {pagination.count} events
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-josseypink1 text-white">
                      {event.class_name || event.class || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => router.push(`/list/events/${event.id}`)}
                        className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                      >
                        <Image src="/view.png" alt="View" width={16} height={16} />
                      </button>
                      {role === "admin" && (
                        <>
                          <FormModal
                            table="event"
                            type="update"
                            data={event}
                            onSuccess={(updatedEvent) => 
                              handleSuccess(updatedEvent, "update")
                            }
                            trigger={
                              <button className="text-josseypink1 hover:text-josseypink2 bg-josseypink1 p-1">
                                <Image src="/update.png" alt="Update" width={16} height={16} />
                              </button>
                            }
                          />
                          <FormModal
                            table="event"
                            type="delete"
                            id={String(event.id)}
                            onSuccess={() => handleSuccess(event, "delete")}
                            trigger={
                              <button className="text-josseypink1 hover:text-josseypink2 bg-josseypink1 p-1">
                                <Image src="/delete.png" alt="Delete" width={16} height={16} />
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
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? "No events found matching your search" : "No events found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.total_pages > 1 && (
        <div className="mt-6">
          <Pagination 
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default EventListPage;