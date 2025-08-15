"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type EventItem = {
  id: number;
  title: string;
  description: string;
  date: string;        // ISO string from backend
  location?: string;
  created_at?: string;
  updated_at?: string;
};

const MAX_EVENTS = 3;

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/events/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        // res.data is expected to be an array of events
        setEvents(Array.isArray(res.data) ? res.data : res.data?.results || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Compute upcoming events: date >= now, sort ascending, take top 3
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
        <button
          aria-label="See more events"
          className="p-1 rounded-md hover:bg-josseypink1 "
          onClick={() => router.push("/list/events")}
        >
          <Image src="/moreDark.png" alt="more" width={20} height={20} />
        </button>
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
                {/* Keep the original “time” spot on the right */}
                <span className="text-gray-300 text-xs">
                  {formatTime(event.date)}
                </span>
              </div>

              {/* Description */}
              <p className="mt-2 text-gray-500 text-sm">{event.description}</p>

              {/* Date + Location (optional) */}
              <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-2">
                <span>📅 {formatDay(event.date)}</span>
                {event.location ? <span>• 📍 {event.location}</span> : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
