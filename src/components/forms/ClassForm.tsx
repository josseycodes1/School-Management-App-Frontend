"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";
import { useState, useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Class name is required"),
  teacher_id: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

type Teacher = {
  id: string;
  user: {
    first_name: string;
    last_name: string;
  };
};

const ClassForm = ({
  type,
  data,
  onSuccess,
  onClose
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to load teachers");
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        teacher_id: data.teacher?.id || null,
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const endpoint =
        type === "create"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/classes/`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/classes/${data?.id}/`;

      const payload = {
        name: formData.name,
        teacher_id: formData.teacher_id || null,
      };

      const response = await axios({
        method: type === "create" ? "post" : "put",
        url: endpoint,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      onSuccess?.(response.data);
      onClose?.();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-josseypink1 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {type === "create" ? "Add New Class" : "Edit Class Details"}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-pink100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Class Name*"
              name="name"
              register={register}
              error={errors.name}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Supervisor</label>
              {loadingTeachers ? (
                <div className="flex items-center justify-center h-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-josseypink1"></div>
                </div>
              ) : (
                <select
                  {...register("teacher_id")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
                >
                  <option value="">No supervisor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.user.first_name} {teacher.user.last_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-pink100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-josseypink1 rounded-lg hover:bg-josseypink2 focus:outline-none focus:ring-4 focus:ring-pink100 disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {type === "create" ? "Create Class" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;