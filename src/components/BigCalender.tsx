"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  
  const getEventsForSelectedDate = () => {
    return calendarEvents.filter(event => 
      moment(event.start).isSame(selectedDate, 'day')
    ).sort((a, b) => moment(a.start).diff(moment(b.start)));
  };

 
  const MobileDayView = () => {
    const dayEvents = getEventsForSelectedDate();
    
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {moment(selectedDate).format('dddd, MMMM D')}
          </h3>
        </div>
        
        {dayEvents.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No classes scheduled for this day
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white border-l-4 border-josseypink1 rounded-r-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-base">
                    {event.title}
                  </h4>
                  <span className="text-sm text-josseypink1 font-medium">
                    {moment(event.start).format('h:mm A')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                </div>
                {/* Safe check for description */}
                {(event as any).description && (
                  <div className="text-sm text-gray-500 mt-2">
                    {(event as any).description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  
  const MobileWeekView = () => {
    const weekStart = moment(selectedDate).startOf('week');
    
    const weekDays = Array.from({ length: 5 }, (_, i) => 
      moment(weekStart).add(i + 1, 'days').toDate()
    );

    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Week of {weekStart.format('MMM D')}
          </h3>
        </div>
        
        <div className="space-y-4 p-4">
          {weekDays.map((day, index) => {
            const dayEvents = calendarEvents.filter(event =>
              moment(event.start).isSame(day, 'day')
            ).sort((a, b) => moment(a.start).diff(moment(b.start)));

            return (
              <div key={index} className="bg-josseypink2 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`font-semibold ${
                    moment(day).isSame(moment(), 'day') 
                      ? 'text-josseypink1 text-lg' 
                      : 'text-gray-900'
                  }`}>
                    {moment(day).format('dddd')}
                  </h4>
                  <span className="text-sm text-gray-600">
                    {moment(day).format('MMM D')}
                  </span>
                </div>
                
                {dayEvents.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-2">
                    No classes
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="bg-white rounded-lg p-3 border-l-4 border-josseypink1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900 text-sm">
                            {event.title}
                          </span>
                          <span className="text-xs text-josseypink1 font-medium">
                            {moment(event.start).format('h:mm A')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                        </div>
                        {/* Safe check for description */}
                        {(event as any).description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {(event as any).description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* View Toggle Buttons */}
      <div className="flex md:hidden bg-josseypink2 rounded-lg p-1 mx-4 mt-4 mb-2">
        <button
          onClick={() => setView(Views.DAY)}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            view === Views.DAY
              ? "bg-white shadow-sm text-josseypink1 border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Day View
        </button>
        <button
          onClick={() => setView(Views.WORK_WEEK)}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            view === Views.WORK_WEEK
              ? "bg-white shadow-sm text-josseypink1 border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Week View
        </button>
      </div>

      {/* Date Navigation for Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <button
          onClick={() => setSelectedDate(moment(selectedDate).subtract(1, view === Views.DAY ? 'day' : 'week').toDate())}
          className="p-2 text-gray-600 hover:text-josseypink1"
        >
          ← Previous
        </button>
        
        <button
          onClick={() => setSelectedDate(new Date())}
          className="text-sm text-josseypink1 font-medium hover:underline"
        >
          Today
        </button>
        
        <button
          onClick={() => setSelectedDate(moment(selectedDate).add(1, view === Views.DAY ? 'day' : 'week').toDate())}
          className="p-2 text-gray-600 hover:text-josseypink1"
        >
          Next →
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Views */}
        <div className="md:hidden flex-1 bg-white rounded-lg mx-4 mb-4 border border-gray-200 overflow-hidden">
          {view === Views.DAY ? <MobileDayView /> : <MobileWeekView />}
        </div>

        {/* Desktop Calendar */}
        <div className="hidden md:block w-full h-full p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-hidden">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              views={["work_week", "day"]}
              view={view}
              className="h-full"
              onView={handleOnChangeView}
              min={new Date(2025, 1, 0, 8, 0, 0)}
              max={new Date(2025, 1, 0, 17, 0, 0)}
              onSelectEvent={(event) => {
                
                console.log('Event selected:', event);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigCalendar;