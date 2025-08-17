"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";
import Image from "next/image";
import { useEffect } from "react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  class_name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const EventForm = ({
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
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title || "",
        description: data.description || "",
        date: data.date?.split('T')[0] || "",
        start_time: data.start_time || "",
        end_time: data.end_time || "",
        location: data.location || "",
        class_name: data.class_name || ""
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    try {
      const endpoint = type === "create" 
        ? "http://localhost:8000/api/events/" 
        : `http://localhost:8000/api/events/${data?.id}/`;

      const response = await axios({
        method: type === "create" ? "post" : "put",
        url: endpoint,
        data: formData,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      onSuccess?.(response.data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-josseypink1 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {type === "create" ? "Create New Event" : "Edit Event Details"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Title*"
              name="title"
              register={register}
              error={errors.title}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">Description*</label>
              <textarea
                {...register("description")}
                rows={4}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <InputField
              label="Date*"
              name="date"
              type="date"
              register={register}
              error={errors.date}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />

            <InputField
              label="Start Time*"
              name="start_time"
              type="time"
              register={register}
              error={errors.start_time}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />

            <InputField
              label="End Time*"
              name="end_time"
              type="time"
              register={register}
              error={errors.end_time}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />

            <InputField
              label="Location"
              name="location"
              register={register}
              error={errors.location}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />

            <InputField
              label="Class Name"
              name="class_name"
              register={register}
              error={errors.class_name}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
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
              className="px-5 py-2.5 text-sm font-medium text-white bg-josseypink1 rounded-lg hover:bg-josseypink2 focus:outline-none focus:ring-4 focus:ring-pink100"
            >
              {type === "create" ? "Create Event" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;