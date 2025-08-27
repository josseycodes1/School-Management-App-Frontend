// components/forms/ExamForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";
import { useState, useEffect } from "react";

const schema = z.object({
  title: z.string().min(1, "Exam title is required"),
  subject: z.string().min(1, "Subject is required"),
  teacher: z.string().min(1, "Teacher is required"),
  exam_date: z.string().min(1, "Exam date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  duration_minutes: z.number().min(1, "Duration must be at least 1 minute").optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Subject {
  id: string;
  name: string;
  code?: string;
}

interface Teacher {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const ExamForm = ({
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
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const watchStartTime = watch("start_time");
  const watchEndTime = watch("end_time");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No access token found");
          return;
        }

        setLoading(true);
        setError("");

        // Fetch subjects
        const subjectsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/subjects/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        // Handle different response structures
        const subjectsData = Array.isArray(subjectsRes.data) 
          ? subjectsRes.data 
          : subjectsRes.data.results || subjectsRes.data.subjects || [];
        
        setSubjects(subjectsData);

        // Fetch teachers
        const teachersRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        // Handle different response structures
        const teachersData = Array.isArray(teachersRes.data) 
          ? teachersRes.data 
          : teachersRes.data.results || teachersRes.data.teachers || [];
        
        setTeachers(teachersData);

      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(`Failed to load form data: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (data) {
      reset({
        title: data.title || "",
        subject: data.subject?.id || "",
        teacher: data.teacher?.id || "",
        exam_date: data.exam_date?.split('T')[0] || "",
        start_time: data.start_time || "",
        end_time: data.end_time || "",
        duration_minutes: data.duration_minutes || undefined,
        description: data.description || "",
      });
    }
  }, [data, reset]);

  const calculateDuration = () => {
    if (!watchStartTime || !watchEndTime) return;

    const start = new Date(`2000-01-01T${watchStartTime}`);
    const end = new Date(`2000-01-01T${watchEndTime}`);
    
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }
    
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    setValue("duration_minutes", durationMinutes);
  };

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const endpoint = type === "create"
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessment/exams/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessment/exams/${data?.id}/`;

      const method = type === "create" ? "post" : "put";

      const response = await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      onSuccess?.(response.data);
      onClose?.();
    } catch (error: any) {
      console.error("Form submission error:", error);
      setError(`Submission failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-josseypink1 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-josseypink1 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {type === "create" ? "Create New Exam" : "Edit Exam Details"}
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

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mx-6 mt-4">
            <div className="flex items-center text-red-700">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Exam Title*"
              name="title"
              register={register}
              error={errors.title}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Subject*</label>
              <select
                {...register("subject")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} {subject.code ? `(${subject.code})` : ''}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
              {subjects.length === 0 && !loading && (
                <p className="mt-1 text-sm text-yellow-600">No subjects available</p>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Teacher*</label>
              <select
                {...register("teacher")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.user?.first_name} {teacher.user?.last_name}
                    {teacher.user?.email ? ` - ${teacher.user.email}` : ''}
                  </option>
                ))}
              </select>
              {errors.teacher && (
                <p className="mt-1 text-sm text-red-600">{errors.teacher.message}</p>
              )}
              {teachers.length === 0 && !loading && (
                <p className="mt-1 text-sm text-yellow-600">No teachers available</p>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Exam Date*</label>
              <input
                type="date"
                {...register("exam_date")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
              {errors.exam_date && (
                <p className="mt-1 text-sm text-red-600">{errors.exam_date.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Start Time</label>
              <input
                type="time"
                {...register("start_time")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
            </div>

            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">End Time</label>
              <input
                type="time"
                {...register("end_time")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
            </div>

            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                {...register("duration_minutes", { valueAsNumber: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
                placeholder="Enter duration in minutes"
              />
              {errors.duration_minutes && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_minutes.message}</p>
              )}
            </div>

            {watchStartTime && watchEndTime && (
              <div className="w-full md:col-span-2">
                <button
                  type="button"
                  onClick={calculateDuration}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                >
                  Calculate Duration from Times
                </button>
              </div>
            )}

            <div className="w-full md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
                placeholder="Optional exam description or instructions"
              />
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
              {type === "create" ? "Create Exam" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;