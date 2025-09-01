// app/list/parents/page.tsx (fixed)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import { toast } from 'react-hot-toast'; 
import Image from "next/image";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";

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
  const [parentsData, setParentsData] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);
    fetchParents();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 403) {
        throw new Error("You don't have permission to view parents");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch parents");
      }

      const data = await res.json();
      setParentsData(data);
      
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setParentsData(parentsData.filter(p => p.id !== id));
      setDeleteConfirm(null);
      toast.success("Parent deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredParents = parentsData.filter(parent => 
    `${parent.user.first_name} ${parent.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Fixed header section - matches teacher page layout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Parent Management</h1>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <TableSearch 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search parents..."
            />
          </div>
          {role === "admin" && (
            <FormModal 
              table="parent" 
              type="create" 
              onSuccess={(newParent) => setParentsData([...parentsData, newParent])}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg"
            />
          )}
        </div>
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
            {filteredParents.length > 0 ? (
              filteredParents.map((parent) => (
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
                      {/* View button - routes to parent detail page */}
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
                            onSuccess={(updatedParent) => 
                              setParentsData(parentsData.map(p => 
                                p.id === updatedParent.id ? updatedParent : p
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
                                />
                              </button>
                            }
                          />
                          <button 
                            onClick={() => setDeleteConfirm(parent.id)}
                            className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                          >
                            <Image 
                              src="/delete.png" 
                              alt="Delete" 
                              width={16} 
                              height={16} 
                              className="w-4 h-4"
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
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No parents found matching your search
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
            <p className="mb-6">Are you sure you want to delete this parent? This action cannot be undone.</p>
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
}