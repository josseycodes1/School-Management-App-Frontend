"use client";

import Image from "next/image";
import FormModal from "@/components/FormModal";
import { useRouter } from 'next/navigation';
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";
import { useState } from "react";
import { isAdmin } from "@/lib/user-role";

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

const EventListPage = () => {
  const router = useRouter();
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  
  const {
    data: events,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    refreshData,
    handleSearchSubmit,
    isClientSideSearch
  } = usePagination<Event>('/api/events/', {
    initialPage: 1,
    pageSize: 10,
  });

  const handleSuccess = (updatedEvent: Event, type: "create" | "update" | "delete") => {
    refreshData();
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "—";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Check if user can edit/delete (only admin)
  const canEditDelete = isAdmin();
  const canCreate = isAdmin();

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Event Management</h1>
          
          {/* Mobile Search Toggle Button */}
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 text-josseypink1 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
          >
            <Image src="/search.png" alt="Search" width={20} height={20} />
          </button>
        </div>

        {/* Search and Create - Desktop */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="w-full md:w-64">
            <TableSearch 
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={handleSearchSubmit}
              placeholder="Search events... (Press Enter for full search)"
            />
          </div>
          
          {/* Only show create button for admin */}
          {canCreate && (
            <FormModal 
              table="event" 
              type="create"
              onSuccess={(data) => handleSuccess(data, "create")}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-colors"
            />
          )}
        </div>

        {/* Mobile Search */}
        {isMobileSearchVisible && (
          <div className="md:hidden">
            <div className="flex items-center gap-2 text-sm rounded-lg ring-2 ring-gray-300 px-3 py-2 bg-white">
              <Image src="/search.png" alt="Search icon" width={16} height={16} className="text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Search events... (Press Enter for full search)"
                className="w-full p-1 bg-transparent outline-none text-gray-700"
                autoFocus
              />
              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Image src="/close.png" alt="Clear" width={16} height={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Create Button - Only for admin */}
        {canCreate && (
          <div className="md:hidden">
            <FormModal 
              table="event" 
              type="create"
              onSuccess={(data) => handleSuccess(data, "create")}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-3 rounded-lg w-full text-center transition-colors"
            />
          </div>
        )}
      </div>

      {/* Updated Results count with search mode */}
      <div className="mb-4 text-sm text-gray-600">
        {isClientSideSearch ? (
          <>
            Showing {events.length} event{events.length !== 1 ? 's' : ''}
            {searchTerm && (
              <> for "<span className="font-medium">{searchTerm}</span>" on this current page, <span className="text-josseypink1 font-medium">press Enter for full search on other pages</span></>
            )}
          </>
        ) : (
          <>
            Showing {events.length} of {pagination.count} event{events.length !== 1 ? 's' : ''}
            {searchTerm && (
              <> for "<span className="font-medium">{searchTerm}</span>" (all data)</>
            )}
          </>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
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
                        className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded transition-colors"
                      >
                        <Image src="/view.png" alt="View" width={16} height={16} />
                      </button>
                      {canEditDelete ? (
                        <>
                          <FormModal
                            table="event"
                            type="update"
                            data={event}
                            onSuccess={(updatedEvent) => handleSuccess(updatedEvent, "update")}
                            trigger={
                              <button className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded transition-colors">
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
                              <button className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded transition-colors">
                                <Image src="/delete.png" alt="Delete" width={16} height={16} />
                              </button>
                            }
                          />
                        </>
                      ) : (
                        // Show disabled buttons with tooltip for non-admin users
                        <>
                          <button 
                            className="text-gray-400 cursor-not-allowed p-1 rounded relative group"
                            disabled
                            title="You don't have permission to edit events"
                          >
                            <Image src="/update.png" alt="Update" width={16} height={16} />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              No permission
                            </div>
                          </button>
                          <button 
                            className="text-gray-400 cursor-not-allowed p-1 rounded relative group"
                            disabled
                            title="You don't have permission to delete events"
                          >
                            <Image src="/delete.png" alt="Delete" width={16} height={16} />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              No permission
                            </div>
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
                  {searchTerm ? "No events found matching your search" : "No events found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => router.push(`/list/events/${event.id}`)}
                    className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded transition-colors"
                  >
                    <Image src="/view.png" alt="View" width={14} height={14} />
                  </button>
                  
                  {canEditDelete ? (
                    <>
                      <FormModal
                        table="event"
                        type="update"
                        data={event}
                        onSuccess={(updatedEvent) => handleSuccess(updatedEvent, "update")}
                        trigger={
                          <button className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded transition-colors">
                            <Image src="/update.png" alt="Update" width={14} height={14} />
                          </button>
                        }
                      />
                      <FormModal
                        table="event"
                        type="delete"
                        id={String(event.id)}
                        onSuccess={() => handleSuccess(event, "delete")}
                        trigger={
                          <button className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded transition-colors">
                            <Image src="/delete.png" alt="Delete" width={14} height={14} />
                          </button>
                        }
                      />
                    </>
                  ) : (
                    // Show disabled buttons for mobile
                    <>
                      <button 
                        className="text-gray-400 cursor-not-allowed p-1 rounded"
                        disabled
                        title="You don't have permission to edit events"
                      >
                        <Image src="/update.png" alt="Update" width={14} height={14} />
                      </button>
                      <button 
                        className="text-gray-400 cursor-not-allowed p-1 rounded"
                        disabled
                        title="You don't have permission to delete events"
                      >
                        <Image src="/delete.png" alt="Delete" width={14} height={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Class:</span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-josseypink1 text-white">
                    {event.class_name || event.class || "—"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{event.location || "—"}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No events found matching your search" : "No events found"}
          </div>
        )}
      </div>

      {/* Only show pagination when not searching or in client-side mode */}
      {(!searchTerm || isClientSideSearch) && pagination.total_pages > 1 && (
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