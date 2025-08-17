"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

type Student = {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  admission_number: string;
  phone: string;
  address: string;
  class_level: string;
  gender?: string;
};

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Pexels photo URLs
  const pexelsMalePhotos = [
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
    "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  ];

  const pexelsFemalePhotos = [
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
    "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg"
  ];

  const getRandomPexelsPhoto = (gender?: string) => {
    const isFemale = gender?.toLowerCase() === "female";
    const photos = isFemale ? pexelsFemalePhotos : pexelsMalePhotos;
    return photos[Math.floor(Math.random() * photos.length)];
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const decodedToken: any = jwtDecode(accessToken);
        setCurrentUserRole(decodedToken.role);

        const res = await axios.get("http://localhost:8000/api/accounts/students/", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setStudents(res.data);
      } catch (err) {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      await axios.delete(`http://localhost:8000/api/accounts/students/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setStudents(students.filter(s => s.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Delete failed");
    }
  };

  const filteredStudents = students.filter(student => 
    `${student.user.first_name} ${student.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-josseypink1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Image
              src="/search-icon.png"
              alt="Search"
              width={16}
              height={16}
              className="absolute left-3 top-3"
            />
          </div>
          {currentUserRole === "admin" && (
            <FormModal 
              table="student" 
              type="create" 
              onSuccess={(newStudent) => setStudents([...students, newStudent])}
              className="bg-josseypink1 hover:bg-josseypink2 text-white px-4 py-2 rounded-lg"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={getRandomPexelsPhoto(student.gender)}
                          alt={`${student.user.first_name}'s profile`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          unoptimized // Since we're using external images
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.user.first_name} {student.user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{student.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.admission_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-josseypink1 text-white">
                      {student.class_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{student.phone || "N/A"}</div>
                    <div className="text-xs text-gray-400">{student.address || "No address"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => router.push(`/list/students/${student.id}`)}
                        className="text-white hover:text-pink-100 bg-josseypink1 hover:bg-josseypink2 p-1 rounded"
                      >
                        <Image src="/view.png" alt="View" width={16} height={16} />
                      </button>
                      {currentUserRole === "admin" && (
                        <>
                          <FormModal
                            table="student"
                            type="update"
                            data={student}
                            onSuccess={(updatedStudent) => 
                              setStudents(students.map(s => 
                                s.id === updatedStudent.id ? updatedStudent : s
                              ))
                            }
                            trigger={
                              <button className="text-josseypink1 hover:text-josseypink2 bg-josseypink1 p-1">
                                <Image src="/update.png" alt="Update" width={16} height={16} />
                              </button>
                            }
                          />
                          <button 
                            onClick={() => setDeleteConfirm(student.id)}
                            className="text-josseypink1 hover:text-josseypink2 bg-josseypink1 p-1"
                          >
                            <Image src="/delete.png" alt="Delete" width={16} height={16} />
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
                  No students found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this student? This action cannot be undone.</p>
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

export default StudentListPage;