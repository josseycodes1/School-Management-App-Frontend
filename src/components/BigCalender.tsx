"use client"

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar"
import moment from "moment"
import { calendarEvents } from "@/lib/data"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from "react"

const localizer = momentLocalizer(moment)

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK)

  // Auto switch view on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView(Views.DAY)
      } else {
        setView(Views.WORK_WEEK)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView)
  }

  return (
    <div className="w-full h-[70vh] sm:h-[80vh] overflow-hidden">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={{ work_week: true, day: true }}
        view={view}
        onView={handleOnChangeView}
        style={{ height: "100%", width: "100%" }}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
      />
    </div>
  )
}

export default BigCalendar
