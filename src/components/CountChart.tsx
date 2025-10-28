"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

interface CountChartProps {
  maleCount: number;
  femaleCount: number;
}

const CountChart = ({ maleCount, femaleCount }: CountChartProps) => {
  const total = maleCount + femaleCount;
  const malePercent = total ? Math.round((maleCount / total) * 100) : 0;
  const femalePercent = total ? Math.round((femaleCount / total) * 100) : 0;

  const data = [
    { name: "Total", count: total, fill: "white" },
    { name: "Girls", count: femaleCount, fill: "#1d4ed8" },
    { name: "Boys", count: maleCount, fill: "#bfdbfe" },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 josseypink1 rounded-full" />
          <h1 className="font-bold">{maleCount}</h1>
          <h2 className="text-xs text-gray-900">Boys ({malePercent}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 josseypink4 rounded-full" />
          <h1 className="font-bold">{femaleCount}</h1>
          <h2 className="text-xs text-gray-900">Girls ({femalePercent}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
