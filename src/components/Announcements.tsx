"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Audience {
  student_first_name?: string | null;
  teacher_first_name?: string | null;
  parent_first_name?: string | null;
}

interface Announcement {
  id: number;
  title: string;
  message: string;
  start_date: string;
  audiences: Audience[];
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/announcements/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer">View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {announcements.length === 0 && (
          <p className="text-gray-400 text-sm">No announcements found.</p>
        )}

        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-josseypink1 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">{announcement.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Date(announcement.start_date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-white mt-1">{announcement.message}</p>

            {announcement.audiences.length > 0 && (
              <div className="mt-2 text-xs text-white">
                <strong>Audience:</strong>{" "}
                {[
                  announcement.audiences.some(a => a.student_first_name) ? "Students" : null,
                  announcement.audiences.some(a => a.teacher_first_name) ? "Teachers" : null,
                  announcement.audiences.some(a => a.parent_first_name) ? "Parents" : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
