// app/list/parents/page.tsx
"use client";

import { useRouter } from 'next/navigation'; 
import { toast } from 'react-hot-toast'; 
import Image from "next/image";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";

type Parent = {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  phone: string;
  address: string;
  emergency_contact: string;
  occupation: string;
  students: string[];
};

export default function ParentListPage() {
  const router = useRouter();

  const {
    data: parentsData,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    refreshData,
    handleSearchSubmit,
    isClientSideSearch
  } = usePagination<Parent>('/api/accounts/parents/', {
    initialPage: 1,
    pageSize: 10,
  });

  const handleSuccess = (updatedParent: Parent, type: "create" | "update" | "delete") => {
    refreshData();
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
        <h1 className="text-2xl font-bold text-gray-800">Parent Management</h1>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <TableSearch 
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={handleSearchSubmit}
              placeholder="Search parents... (Press Enter for full search)"
            />
          </div>
          {role === "admin" && (
            <FormModal 
              table="parent" 
              type="create" 
              onSuccess={(newParent) => handleSuccess(newParent, "create")}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Updated Results count with search mode */}
      <div className="mb-4 text-sm text-gray-600">
        {isClientSideSearch ? (
          <>
            Showing {parentsData.length} parent{parentsData.length !== 1 ? 's' : ''} 
            {searchTerm && (
              <> for "<span className="font-medium">{searchTerm}</span>" (current page)</>
            )}
          </>
        ) : (
          <>
            Showing {parentsData.length} of {pagination.count} parent{parentsData.length !== 1 ? 's' : ''} 
            {searchTerm && (
              <> for "<span className="font-medium">{searchTerm}</span>" (all data)</>
            )}
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parentsData.length > 0 ? (
              parentsData.map((parent) => (
                <tr key={parent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src="/avatar.png"
                          alt={`${parent.user.first_name}'s profile`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {parent.user.first_name} {parent.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{parent.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{parent.phone || "N/A"}</div>
                    <div className="text-xs text-gray-400">{parent.emergency_contact || "No emergency contact"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parent.occupation || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(parent.students) && parent.students.length > 0 
                      ? parent.students.join(", ")
                      : "No students"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => router.push(`/list/parents/${parent.id}`)}
                        className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                      >
                        <Image 
                          src="/view.png" 
                          alt="View" 
                          width={16} 
                          height={16} 
                          className="w-4 h-4"
                        />
                      </button>
                      
                      {role === "admin" && (
                        <>
                          <FormModal
                            table="parent"
                            type="update"
                            data={parent}
                            onSuccess={(updatedParent) => handleSuccess(updatedParent, "update")}
                            trigger={
                              <button className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded">
                                <Image 
                                  src="/update.png" 
                                  alt="Update" 
                                  width={16} 
                                  height={16} 
                                  className="w-4 h-4"
                                />
                              </button>
                            }
                          />
                          <FormModal
                            table="parent"
                            type="delete"
                            id={String(parent.id)}
                            onSuccess={() => handleSuccess(parent, "delete")}
                            trigger={
                              <button className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded">
                                <Image 
                                  src="/delete.png" 
                                  alt="Delete" 
                                  width={16} 
                                  height={16} 
                                  className="w-4 h-4"
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
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? "No parents found matching your search" : "No parents found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
}