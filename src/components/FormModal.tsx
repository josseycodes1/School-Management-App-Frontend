"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-josseypink1 mx-auto"></div>
    </div>
  )
});

const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-josseypink1 mx-auto"></div>
    </div>
  )
});

const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-josseypink1 mx-auto"></div>
    </div>
  )
});

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-josseypink1 mx-auto"></div>
    </div>
  )
});

type FormModalProps = {
  table: string;
  type: "create" | "update" | "delete" | "view";
  id?: string; 
  data?: any;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  className?: string;
  buttonStyle?: string;
  trigger?: React.ReactNode;
  onDelete?: (id: string) => void;
};

const FormModal = ({
  table,
  type,
  id,
  data,
  onSuccess,
  onClose,
  className = "",
  buttonStyle = "",
  trigger,
}: FormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (data: any) => {
    onSuccess?.(data);
    setIsOpen(false);
    onClose?.();
  };

  const getButtonText = () => {
    if (trigger) return null;
    
    if (table === "teacher") {
      return type === "create" ? "Add Teacher" : "Edit";
    } else if (table === "announcement") {
      return type === "create" ? "Add Announcement" : "Edit";
    } else if (table === "event") {
      return type === "create" ? "Add Event" : "Edit";
    } else if (table === "student") {
      return type === "create" ? "Add Student" : "Edit";
    }
    return "";
  };

  const getDeleteMessage = () => {
    if (table === "teacher") {
      return "Are you sure you want to delete this teacher?";
    } else if (table === "announcement") {
      return "Are you sure you want to delete this announcement?";
    } else if (table === "event") {
      return "Are you sure you want to delete this event?";
    } else if (table === "student") {
      return "Are you sure you want to delete this student?";
    }
    return "";
  };

  const getDeleteEndpoint = () => {
    if (table === "teacher") {
      return `http://localhost:8000/api/accounts/teachers/${id}/`;
    } else if (table === "announcement") {
      return `http://localhost:8000/api/announcements/${id}/`;
    } else if (table === "event") {
      return `http://localhost:8000/api/events/${id}/`;
    } else if (table === "student") {
      return `http://localhost:8000/api/accounts/students/${id}/`;
    }
    return "";
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`${className} ${buttonStyle} flex items-center justify-center ${
            type === "delete" ? "text-red-500 hover:text-red-700" : 
            type === "view" ? "text-josseypink1 hover:text-josseypink2" : 
            "text-josseypink1 hover:text-josseypink2"
          }`}
        >
          {getButtonText()}
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {type === "delete" ? (
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                <p className="mb-6 text-gray-600">
                  {getDeleteMessage()}
                </p>
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          getDeleteEndpoint(),
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                            }
                          }
                        );
                        handleSuccess({ id });
                      } catch (error) {
                        console.error("Delete failed:", error);
                      }
                    }}
                    className="px-6 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            ) : type === "view" ? (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {table === "teacher" ? "Teacher Details" : 
                   table === "announcement" ? "Announcement Details" : 
                   table === "event" ? "Event Details" :
                   "Student Details"}
                </h2>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {table === "teacher" && (
                  <TeacherForm 
                    type={type} 
                    data={data} 
                    onSuccess={handleSuccess}
                    onClose={() => setIsOpen(false)}
                  />
                )}
                {table === "announcement" && (
                  <AnnouncementForm
                    type={type}
                    data={data}
                    onSuccess={handleSuccess}
                    onClose={() => setIsOpen(false)}
                  />
                )}
                {table === "event" && (
                  <EventForm
                    type={type}
                    data={data}
                    onSuccess={handleSuccess}
                    onClose={() => setIsOpen(false)}
                  />
                )}
                {table === "student" && (
                  <StudentForm
                    type={type}
                    data={data}
                    onSuccess={handleSuccess}
                    onClose={() => setIsOpen(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;