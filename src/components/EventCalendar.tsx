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

const MAX_EVENTS = 2;


const EventSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(MAX_EVENTS)].map((_, index) => (
        <div
          key={index}
          className="p-5 rounded-md border-2 border-gray-100 border-t-4 border-t-gray-200 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="mt-2 flex gap-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

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
      <div className="relative">
        <Calendar onChange={onChange} value={value} />
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-josseypink1"></div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-xl font-semibold">Events</h1>
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
      <div className="mt-4">
        {loading ? (
          <EventSkeleton />
        ) : upcoming.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming events.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((event) => (
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
                  className="text-xs text-josseypink1 hover:underline mt-1"
                >
                  View More
                </button>

                <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-2">
                  <span>📅 {formatDay(event.date)}</span>
                  {event.location && <span>• 📍 {event.location}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;