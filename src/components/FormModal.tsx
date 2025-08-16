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

type FormModalProps = {
  table: string;
  type: "create" | "update" | "delete" | "view";
  id?: number;
  data?: any;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  className?: string;
  buttonStyle?: string;
  trigger?: React.ReactNode;
};

const FormModal = ({
  table,
  type,
  id,
  data,
  onSuccess,
  className = "",
  buttonStyle = "",
  trigger,
}: FormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (data: any) => {
    onSuccess?.(data);
    setIsOpen(false);
  };

  const getButtonText = () => {
    if (trigger) return null;
    
    if (table === "teacher") {
      return type === "create" ? "Add New Teacher" : 
             type === "update" ? "Edit" : 
             type === "delete" ? "Delete" : "View";
    } else if (table === "announcement") {
      return type === "create" ? "Add Announcement" : 
             type === "update" ? "Edit" : 
             type === "delete" ? "Delete" : "View";
    }
    return "";
  };

  const getDeleteMessage = () => {
    if (table === "teacher") {
      return "Are you sure you want to permanently delete this teacher record? This action cannot be undone.";
    } else if (table === "announcement") {
      return "Are you sure you want to permanently delete this announcement? This action cannot be undone.";
    }
    return "";
  };

  const getDeleteEndpoint = () => {
    if (table === "teacher") {
      return `http://localhost:8000/api/accounts/teachers/${id}/`;
    } else if (table === "announcement") {
      return `http://localhost:8000/api/announcements/${id}/`;
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
                        onSuccess?.({ id });
                        setIsOpen(false);
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
                  {table === "teacher" ? "Teacher Details" : "Announcement Details"}
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;