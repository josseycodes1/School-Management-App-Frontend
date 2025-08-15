"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios"; 

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <p>Loading form...</p>
});

const FormModal = ({
  table,
  type,
  id,
  data,
  onSuccess,
}: {
  table: "teacher" | "student";
  type: "create" | "update" | "delete";
  id?: number;
  data?: any;
  onSuccess?: (data: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (data: any) => {
    onSuccess?.(data);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/accounts/teachers/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      onSuccess?.({ id });
      setIsOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${type === "create" ? "w-8 h-8" : "w-7 h-7"} flex items-center justify-center rounded-full ${
          type === "create" ? "bg-josseypink1" : 
          type === "update" ? "bg-josseypink2" : "bg-red-500"
        }`}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md relative">
            {type === "delete" ? (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                <p className="mb-6">Are you sure you want to delete this {table}?</p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <TeacherForm 
                type={type} 
                data={data} 
                onSuccess={handleSuccess}
                onClose={() => setIsOpen(false)}
              />
            )}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
            >
              <Image src="/close.png" alt="Close" width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;