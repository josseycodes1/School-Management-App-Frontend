"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import FormModal from "@/components/FormModal";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
};

const MAX_EVENTS = 2; // Changed from 3 to 2

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "student";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setEvents(Array.isArray(res.data) ? res.data : res.data?.results || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcoming = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => {
        const d = new Date(e.date);
        return !Number.isNaN(d.getTime()) && d >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, MAX_EVENTS);
  }, [events]);

  const formatDay = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="bg-white p-4 rounded-md">
      {/* Calendar */}
      <Calendar onChange={onChange} value={value} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <FormModal
              table="event"
              type="create"
              className="p-1 rounded-md bg-josseypink1"
              trigger={
                <button className="p-1 rounded-md bg-josseypink1">
                  <Image src="/add.png" alt="Add" width={20} height={20} />
                </button>
              }
            />
          )}
          <button
            className="text-xs text-gray-400 cursor-pointer hover:bg-josseypink1 hover:text-white p-2 rounded transition-colors"
            onClick={() => router.push("/list/events")}
          >
            View All
          </button>
        </div>
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading events...</p>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming events.</p>
        ) : (
          upcoming.map((event) => (
            <div
              key={event.id}
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 border-t-josseypink1"
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-700">{event.title}</h1>
                <div className="flex gap-2">
                  {role === "admin" && (
                    <>
                      <FormModal
                        table="event"
                        type="update"
                        data={event}
                        trigger={
                          <button className="p-1 rounded-md hover:bg-josseypink1">
                            <Image src="/update.png" alt="Edit" width={16} height={16} />
                          </button>
                        }
                      />
                      <FormModal
                        table="event"
                        type="delete"
                        id={event.id}
                        trigger={
                          <button className="p-1 rounded-md hover:bg-red-100">
                            <Image src="/delete.png" alt="Delete" width={16} height={16} />
                          </button>
                        }
                      />
                    </>
                  )}
                  <span className="text-gray-300 text-xs">
                    {formatTime(event.date)}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-gray-500 text-sm line-clamp-2">
                  {event.description}
                </p>
                <button
                  onClick={() => router.push("/list/events")}
                  className="text-xs text-pink-500 hover:underline mt-1"
                >
                  View More
                </button>


              <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-2">
                <span>📅 {formatDay(event.date)}</span>
                {event.location && <span>• 📍 {event.location}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;