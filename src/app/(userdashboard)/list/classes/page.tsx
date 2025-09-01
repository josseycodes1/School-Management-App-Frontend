"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import { useRouter } from 'next/navigation';
import { role } from "@/lib/data";

type Class = {
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
  created_at: string;
};

const ClassListPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const fetchClasses = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/classes/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setClasses(res.data);
      } catch (err) {
        setError("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/classes/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setClasses(classes.filter(c => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Delete failed");
    }
  };

  const filteredClasses = classes.filter(classItem => 
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (classItem.teacher && 
      `${classItem.teacher.user.first_name} ${classItem.teacher.user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()))
  );

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
        <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <TableSearch 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search classes..."
            />
          </div>
          
          {role === "admin" && (
            <FormModal 
              table="class" 
              type="create" 
              onSuccess={(newClass) => setClasses([...classes, newClass])}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg whitespace-nowrap"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {classItem.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {classItem.teacher ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {classItem.teacher.user.first_name} {classItem.teacher.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{classItem.teacher.user.email}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No supervisor assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(classItem.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => router.push(`/list/classes/${classItem.id}`)}
                        className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                      >
                        <Image 
                          src="/view.png" 
                          alt="View" 
                          width={16} 
                          height={16} 
                          className="w-4 h-4"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </button>
                      {role === "admin" && (
                        <>
                          <FormModal
                            table="class"
                            type="update"
                            data={classItem}
                            onSuccess={(updatedClass) => 
                              setClasses(classes.map(c => 
                                c.id === updatedClass.id ? updatedClass : c
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
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </button>
                            }
                          />
                          <button 
                            onClick={() => setDeleteConfirm(classItem.id)}
                            className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                          >
                            <Image 
                              src="/delete.png" 
                              alt="Delete" 
                              width={16} 
                              height={16} 
                              className="w-4 h-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
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
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No classes found matching your search
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
            <p className="mb-6">Are you sure you want to delete this class? This action cannot be undone.</p>
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

export default ClassListPage;