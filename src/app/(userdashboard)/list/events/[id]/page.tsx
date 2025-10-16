"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { toast } from "react-hot-toast";
import { isAdmin } from "@/lib/user-role";

type Event = {
  id: number;
  title: string;
  description?: string;
  class_name?: string;
  class?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
};

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user can edit/delete (only admin)
  const canEditDelete = isAdmin();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${params.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setEvent(res.data);
      } catch (err) {
        setError("Failed to load event details");
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const handleSuccess = (updatedEvent: Event, type: "update" | "delete") => {
    if (type === "update") {
      setEvent(updatedEvent);
      toast.success("Event updated successfully");
    } else if (type === "delete") {
      toast.success("Event deleted successfully");
      router.push("/list/events");
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "—";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
    </div>
  );

  if (error) return (
    <div className="bg-pink-100 border-l-4 border-josseypink1 p-4 mb-4">
      <div className="flex items-center text-josseypink1">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    </div>
  );

  if (!event) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Event not found</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-josseypink1 hover:text-josseypink2 mr-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Event Details</h1>
      </div>

      {/* Event Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
            {event.class_name || event.class ? (
              <span className="inline-block px-3 py-1 bg-josseypink1 text-white text-sm font-semibold rounded-full">
                {event.class_name || event.class}
              </span>
            ) : null}
          </div>
          
          {canEditDelete && (
            <div className="flex space-x-2">
              <FormModal
                table="event"
                type="update"
                data={event}
                onSuccess={(updatedEvent) => handleSuccess(updatedEvent, "update")}
                trigger={
                  <button className="flex items-center px-3 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2">
                    <Image src="/update.png" alt="Edit" width={16} height={16} className="mr-2" />
                    Edit
                  </button>
                }
              />
              <FormModal
                table="event"
                type="delete"
                id={String(event.id)}
                onSuccess={() => handleSuccess(event, "delete")}
                trigger={
                  <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <Image src="/delete.png" alt="Delete" width={16} height={16} className="mr-2" />
                    Delete
                  </button>
                }
              />
            </div>
          )}
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <p className="text-lg font-semibold text-gray-800">
                {formatDate(event.date)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
              <p className="text-lg font-semibold text-gray-800">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
              <p className="text-lg font-semibold text-gray-800">
                {event.location || "Not specified"}
              </p>
            </div>
            
            {event.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
                <p className="text-sm text-gray-500">
                  {new Date(event.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Information</h3>
        <p className="text-sm text-gray-600">
          This event is {event.class_name || event.class ? `for ${event.class_name || event.class} class` : "a general event"}.
          {event.location && ` It will take place at ${event.location}.`}
        </p>
      </div>
    </div>
  );
};

export default EventDetailPage;