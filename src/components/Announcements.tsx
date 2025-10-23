"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Announcement {
  id: number;
  title: string;
  message: string;
  start_date: string;
  target_students: boolean;
  target_teachers: boolean;
  target_parents: boolean;
  target_roles: string[];
}

const Announcements = ({ limit = 3 }: { limit?: number }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        //get only the first 'limit' announcements, sorted by date (newest first)
        const sortedAnnouncements = res.data.sort(
          (a: Announcement, b: Announcement) => 
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        setAnnouncements(sortedAnnouncements.slice(0, limit));
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, [limit]);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <button>
          <span 
            className="text-xs text-gray-400 cursor-pointer hover:bg-josseypink1 p-2" 
            onClick={() => router.push("/list/announcements")}
          >
            View All
          </span>
        </button>
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

            <p className="text-sm text-white mt-1 line-clamp-2">
                {announcement.message}
              </p>
              <button
                onClick={() => router.push("/list/announcements")}
                className="text-xs text-white underline mt-1"
              >
                View More
              </button>

            <div className="mt-2 text-xs text-white">
              <strong>Audience:</strong> {announcement.target_roles.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;