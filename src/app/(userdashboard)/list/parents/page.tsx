"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import { toast } from 'react-hot-toast'; 

// Define the shape of a parent
type Parent = {
  id: number;
  name: string;
  email?: string;
  students: string[]; // Should be an array
  phone: string;
  address: string;
};

export default function ParentList() {
  const [parentsData, setParentsData] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

     
  
  
  
  
  
const fetchParents = async () => {
  setLoading(true);
  
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login again");
      router.push("/login");
      return;
    }

    const res = await fetch("http://localhost:8000/api/accounts/parents/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle 403 specifically
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
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }
  } finally {
    setLoading(false);
  }
};





    useEffect(() => {
      fetchParents();
    }, []);

    if (loading) {
      return <p className="text-center mt-10 text-gray-600">Loading parents...</p>;
    }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Parent List</h1>

      {parentsData.length === 0 ? (
        <p className="text-gray-600">No parents found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 hidden md:table-cell">Email</th>
                <th className="px-4 py-2 hidden md:table-cell">Students</th>
                <th className="px-4 py-2 hidden md:table-cell">Phone</th>
                <th className="px-4 py-2 hidden md:table-cell">Address</th>
              </tr>
            </thead>
            <tbody>
              {parentsData.map((item) => (
                <tr key={item.id} className="border-t text-sm text-gray-700">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 hidden md:table-cell">{item.email || "N/A"}</td>
                  <td className="px-4 py-2 hidden md:table-cell">
                    {Array.isArray(item.students) ? item.students.join(", ") : "No students"}
                  </td>
                  <td className="px-4 py-2 hidden md:table-cell">{item.phone}</td>
                  <td className="px-4 py-2 hidden md:table-cell">{item.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
