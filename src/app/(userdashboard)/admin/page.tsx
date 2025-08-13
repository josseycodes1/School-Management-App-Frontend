"use client"
import { useEffect, useState } from "react";
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import axios from "axios";

const AdminPage = () => {
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/accounts/user-counts/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // JWT token
        },
      })
      .then((res) => {
        setCounts(res.data);
      })
      .catch((err) => console.error("Error fetching counts:", err));
  }, []);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap text-white">
          <UserCard type="student" count={counts.students} />
          <UserCard type="teacher" count={counts.teachers} />
          <UserCard type="parent" count={counts.parents} />
          <UserCard type="staff" count={0} /> {/* Placeholder for now */}
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
