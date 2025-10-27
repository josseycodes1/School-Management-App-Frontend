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


const AnnouncementSkeleton = ({ limit = 2 }: { limit?: number }) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {[...Array(limit)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded-md p-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="mt-2">
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Announcements = ({ limit = 2 }: { limit?: number }) => {
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
        
        
        let announcementsData: Announcement[] = [];
        
        if (Array.isArray(res.data)) {
          announcementsData = res.data;
        } else if (res.data.results && Array.isArray(res.data.results)) {
          announcementsData = res.data.results;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          announcementsData = res.data.data;
        }
        
        
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

      {loading ? (
        <AnnouncementSkeleton limit={limit} />
      ) : announcements.length === 0 ? (
        <div className="mt-4">
          <p className="text-gray-500 text-sm">No announcements found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {announcements.map((announcement) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;