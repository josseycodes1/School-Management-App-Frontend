
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";

type Parent = {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  phone: string;
  address: string;
  emergency_contact: string;
  occupation: string;
  students: string[]; // This should be an array of strings based on your initial type
  created_at: string;
  updated_at: string;
};

export default function ParentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchParent = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Please login again");
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/${params.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch parent details");
        }

        const data = await res.json();
        setParent(data);
      } catch (error) {
        toast.error("Error loading parent details");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParent();
  }, [params.id, router]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/${params.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Parent deleted successfully");
      router.push("/list/parents");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Parent Not Found</h2>
          <p className="text-gray-600 text-center mb-6">The parent you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/list/parents")}
            className="w-full bg-josseypink1 text-white py-2 rounded-lg hover:bg-josseypink2 transition-colors"
          >
            Back to Parents List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Details</h1>
              <p className="text-gray-600 mt-1">Complete information about the parent</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/list/parents")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to List
              </button>
              {role === "admin" && (
                <>
                  <FormModal
                    table="parent"
                    type="update"
                    data={parent}
                    onSuccess={(updatedParent) => setParent(updatedParent)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  />
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <Image
                  src="/avatar.png"
                  alt={`${parent.user.first_name}'s profile`}
                  width={96}
                  height={96}
                  className="rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {parent.user.first_name} {parent.user.last_name}
              </h2>
              <p className="text-gray-600">{parent.occupation}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{parent.user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium">{parent.user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{parent.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Emergency Contact:</span>
                <span className="font-medium">{parent.emergency_contact || "Not provided"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Occupation:</span>
                <span className="font-medium">{parent.occupation}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
              <p className="text-gray-600">{parent.address}</p>
            </div>

            {/* Students Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Associated Students ({parent.students?.length || 0})
              </h3>
              
              {parent.students && parent.students.length > 0 ? (
                <div className="space-y-2">
                  {parent.students.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700">{student}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No students associated with this parent</p>
              )}
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(parent.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(parent.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete {parent.user.first_name}'s account? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}