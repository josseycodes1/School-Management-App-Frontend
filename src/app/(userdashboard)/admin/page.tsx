"use client"
import { useEffect, useState } from "react";
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import axios from "axios";

interface Counts {
  students: number;
  teachers: number;
  parents: number;
  male_students: number;
  female_students: number;
}

const AdminPage = () => {
  const [counts, setCounts] = useState<Counts>({
    students: 0,
    teachers: 0,
    parents: 0,
    male_students: 0,
    female_students: 0,
  });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/user-counts/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setCounts(res.data))
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
          <UserCard type="staff" count={0} /> 
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart
              maleCount={counts.male_students}
              femaleCount={counts.female_students}
            />
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
