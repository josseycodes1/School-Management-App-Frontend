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

const Announcements = ({ limit = 2 }: { limit?: number }) => { // Changed from 3 to 2
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        
        console.log("Announcements API response:", res.data);
        
        // Handle different response formats
        let announcementsData: Announcement[] = [];
        
        if (Array.isArray(res.data)) {
          // If response is directly an array
          announcementsData = res.data;
        } else if (res.data.results && Array.isArray(res.data.results)) {
          // If response has pagination structure
          announcementsData = res.data.results;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          // If response has data property
          announcementsData = res.data.data;
        }
        
        // Get only the first 'limit' announcements, sorted by date (newest first)
        const sortedAnnouncements = announcementsData.sort(
          (a: Announcement, b: Announcement) => 
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        
        const limitedAnnouncements = sortedAnnouncements.slice(0, limit);
        console.log(`Showing ${limitedAnnouncements.length} announcements:`, limitedAnnouncements);
        setAnnouncements(limitedAnnouncements);
      } catch (err: any) {
        console.error("Error fetching announcements:", err);
        console.error("Error details:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [limit]);

  if (loading) {
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
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <button>
          <span 
            className="text-xs text-gray-400 cursor-pointer hover:bg-josseypink1 hover:text-white p-2 rounded transition-colors" 
            onClick={() => router.push("/list/announcements")}
          >
            View All
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {announcements.length === 0 ? (
          <p className="text-gray-400 text-sm">No announcements found.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-josseypink1 rounded-md p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-white">{announcement.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-2 py-1">
                  {new Date(announcement.start_date).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-white mt-2 line-clamp-2">
                {announcement.message}
              </p>
              
              <button
                onClick={() => router.push("/list/announcements")}
                className="text-xs text-white underline mt-2 hover:no-underline"
              >
                View More
              </button>

              <div className="mt-2 text-xs text-white">
                <strong>Audience:</strong> {announcement.target_roles.join(", ")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;