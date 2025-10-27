
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

const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-josseypink1 mx-auto"></div>
    </div>
  )
});

type FormModalProps = {
  table: string;
  type: "create" | "update" | "delete" | "view";
  id?: string | number; 
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
  const [isDeleting, setIsDeleting] = useState(false);

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
    } else if (table === "exam") {
      return type === "create" ? "Add Exam" : "Edit";
    } else if (table === "parent") {
      return type === "create" ? "Add Parent" : "Edit";
    } else if (table === "subject") {
      return type === "create" ? "Add Subject" : "Edit";
    } else if (table === "class") {
      return type === "create" ? "Add Class" : "Edit";
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
    } else if (table === "exam") {
      return "Are you sure you want to delete this exam?";
    }
    return "";
  };

const getDeleteEndpoint = () => {
  if (table === "teacher") {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/${id}/`;
  } else if (table === "announcement") {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/${id}/`;
  } else if (table === "event") {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${id}/`;
  } else if (table === "student") {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/${id}/`;
  } else if (table === "exam") {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessment/exams/${id}/`;
  }
  return "";
};


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      await axios.delete(
        getDeleteEndpoint(),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      handleSuccess({ id });
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTriggerIcon = () => {
    if (type === "delete") {
      return (
        <Image 
          src="/delete.png" 
          alt="Delete" 
          width={16} 
          height={16} 
          className="w-4 h-4"
        />
      );
    } else if (type === "view") {
      return (
        <Image 
          src="/view.png" 
          alt="View" 
          width={16} 
          height={16} 
          className="w-4 h-4"
        />
      );
    } else if (type === "update") {
      return (
        <Image 
          src="/update.png" 
          alt="Update" 
          width={16} 
          height={16} 
          className="w-4 h-4"
        />
      );
    }
    return null;
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`${className} ${buttonStyle} flex items-center justify-center gap-1 ${
            type === "delete" 
              ? "text-red-600 hover:text-red-800" 
              : type === "view" 
              ? "text-josseypink1 hover:text-josseypink10" 
              : "text-josseypink1 hover:text-josseypink2"
          }`}
        >
          {getTriggerIcon()}
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
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    disabled={isDeleting}
                  >
                    {isDeleting && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    Delete Permanently
                  </button>
                </div>
              </div>
            ) : type === "view" ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {table === "teacher" ? "Teacher Details" : 
                     table === "announcement" ? "Announcement Details" : 
                     table === "event" ? "Event Details" :
                     table === "exam" ? "Exam Details" :
                     "Student Details"}
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* View content would go here based on the table type */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-center">View functionality to be implemented</p>
                </div>
                
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2 transition-colors"
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
                {table === "exam" && (
                  <ExamForm
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