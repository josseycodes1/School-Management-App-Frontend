"use client";

import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

type Audience = {
  student_first_name?: string | null;
  teacher_first_name?: string | null;
  parent_first_name?: string | null;
};

type Announcement = {
  id: number;
  title: string;
  message: string;
  start_date: string;
  audiences: Audience[];
};

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Message", accessor: "message", className: "hidden md:table-cell" },
  { header: "Date", accessor: "start_date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const AnnouncementListPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "student"; // Example, replace with actual role logic

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/announcements/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const renderRow = (item: Announcement) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-pink-100 text-sm hover:bg-josseypink1"
    >
      <td className="flex flex-col gap-1 p-4">
        <span>{item.title}</span>
        <span className="text-xs text-white">
          {item.audiences.length > 0 &&
            [
              item.audiences.some(a => a.student_first_name) ? "Students" : null,
              item.audiences.some(a => a.teacher_first_name) ? "Teachers" : null,
              item.audiences.some(a => a.parent_first_name) ? "Parents" : null,
            ]
              .filter(Boolean)
              .join(", ")}
        </span>
      </td>
      <td className="hidden md:table-cell">{item.message}</td>
      <td className="hidden md:table-cell">
        {new Date(item.start_date).toLocaleDateString()}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="announcement" type="update" data={item} />
              <FormModal table="announcement" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-josseypink1">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-josseypink1">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="announcement" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={announcements} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AnnouncementListPage;
