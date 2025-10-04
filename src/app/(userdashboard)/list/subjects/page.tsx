// app/list/subjects/page.tsx
"use client";

import Image from "next/image";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import { useRouter } from 'next/navigation';
import { role } from "@/lib/data";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";

type Subject = {
  id: string;
  name: string;
  teacher: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  } | null;
  assigned_class: number;
  assigned_class_name: string;
  created_at: string;
};

const SubjectListPage = () => {
  const router = useRouter();

  const {
    data: subjects,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    refreshData
  } = usePagination<Subject>('/api/accounts/subjects/', {
    initialPage: 1,
    pageSize: 10,
    debounceDelay: 300
  });

  const handleSuccess = (updatedSubject: Subject, type: "create" | "update" | "delete") => {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Subject Management</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <TableSearch 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search subjects..."
            />
          </div>
          
          {role === "admin" && (
            <FormModal 
              table="subject" 
              type="create" 
              onSuccess={(newSubject) => handleSuccess(newSubject, "create")}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            />
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {subjects.length} of {pagination.count} subjects
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subject.teacher ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {subject.teacher.user.first_name} {subject.teacher.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{subject.teacher.user.email}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No teacher assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.assigned_class_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => router.push(`/list/subjects/${subject.id}`)}
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
                            table="subject"
                            type="update"
                            data={subject}
                            onSuccess={(updatedSubject) => handleSuccess(updatedSubject, "update")}
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
                            table="subject"
                            type="delete"
                            id={String(subject.id)}
                            onSuccess={() => handleSuccess(subject, "delete")}
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
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? "No subjects found matching your search" : "No subjects found"}
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

export default SubjectListPage;