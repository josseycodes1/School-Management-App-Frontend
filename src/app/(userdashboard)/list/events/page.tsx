"use client";

import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import axios from "axios";
import { role } from "@/lib/data";

// Raw type from backend
type EventAPI = {
  id: number;
  title: string;
  class_name?: string; // backend may return this
  class?: string;      // or this
  date: string;        // ISO date
  start_time?: string;
  end_time?: string;
};

// Formatted type for the table
type EventRow = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
};

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Class", accessor: "class" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell" },
  { header: "End Time", accessor: "endTime", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const EventListPage = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/events/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        // Normalise data for the table
        const rawEvents: EventAPI[] = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];

        const formatted: EventRow[] = rawEvents.map((e) => ({
          id: e.id,
          title: e.title,
          class: e.class_name || e.class || "—",
          date: new Date(e.date).toLocaleDateString(),
          startTime: e.start_time
            ? new Date(`1970-01-01T${e.start_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "—",
          endTime: e.end_time
            ? new Date(`1970-01-01T${e.end_time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "—",
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderRow = (item: EventRow) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-pink-100 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td className="hidden md:table-cell">{item.startTime}</td>
      <td className="hidden md:table-cell">{item.endTime}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="event" type="update" data={item} />
              <FormModal table="event" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500 text-sm mt-4">Loading events...</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={events} />
      )}

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default EventListPage;
