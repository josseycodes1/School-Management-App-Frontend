"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import FormModal from "@/components/FormModal";
import Image from "next/image";
import { role } from "@/lib/data";

type Teacher = {
  id: number;
  user: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  profile_picture?: string;
  phone_number?: string;
  address?: string;
  subject_specialization?: string;
};

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/accounts/teachers/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setTeachers(response.data);
      } catch (err) {
        setError("Failed to fetch teachers");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSuccess = (data: any) => {
    if (data.id) {
      // Update existing teacher
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === data.id ? data : teacher))
      );
    } else {
      // Add new teacher
      setTeachers((prev) => [...prev, data]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/accounts/teachers/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    } catch (err) {
      setError("Failed to delete teacher");
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="p-4">Loading teachers...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Teachers</h1>
        {role === "admin" && (
          <FormModal table="teacher" type="create" onSuccess={handleSuccess} />
        )}
      </div>

      <div className="space-y-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <Image
                src={teacher.profile_picture || "/default-teacher.png"}
                alt="Teacher"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-medium">
                  {teacher.user.first_name} {teacher.user.last_name}
                </h3>
                <p className="text-sm text-gray-500">{teacher.user.email}</p>
                <p className="text-sm">
                  {teacher.subject_specialization || "No specialization"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Image src="/view.png" alt="View" width={16} height={16} />
              </button>
              {role === "admin" && (
                <>
                  <FormModal
                    table="teacher"
                    type="update"
                    data={teacher}
                    onSuccess={handleSuccess}
                  />
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Image src="/delete.png" alt="Delete" width={16} height={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherListPage;