"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";
import { useEffect } from "react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  start_date: z.string().min(1, "Date is required"),
  target_students: z.boolean().default(false),
  target_teachers: z.boolean().default(false),
  target_parents: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

const AnnouncementForm = ({
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
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      target_students: false,
      target_teachers: false,
      target_parents: false,
      is_active: true,
    }
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title || "",
        message: data.message || "",
        start_date: data.start_date?.split('T')[0] || "",
        target_students: data.target_students || false,
        target_teachers: data.target_teachers || false,
        target_parents: data.target_parents || false,
        is_active: data.is_active !== undefined ? data.is_active : true,
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    try {
      const endpoint = type === "create" 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/` 
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/${data?.id}/`;

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
              {type === "create" ? "Create New Announcement" : "Edit Announcement"}
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
              label="Title*"
              name="title"
              register={register}
              error={errors.title}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Message*</label>
              <textarea
                {...register("message")}
                rows={4}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <InputField
              label="Start Date*"
              name="start_date"
              type="date"
              register={register}
              error={errors.start_date}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Target Audience*</label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("target_students")}
                    className="w-4 h-4 text-josseypink1 rounded border-gray-300 focus:ring-josseypink2"
                  />
                  <span>Students</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("target_teachers")}
                    className="w-4 h-4 text-josseypink1 rounded border-gray-300 focus:ring-josseypink2"
                  />
                  <span>Teachers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("target_parents")}
                    className="w-4 h-4 text-josseypink1 rounded border-gray-300 focus:ring-josseypink2"
                  />
                  <span>Parents</span>
                </label>
              </div>
              {!watch("target_students") && !watch("target_teachers") && !watch("target_parents") && (
                <p className="mt-1 text-sm text-red-600">At least one audience is required</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="w-4 h-4 text-josseypink1 rounded border-gray-300 focus:ring-josseypink2"
                />
                <span className="text-sm font-medium text-gray-900">Active</span>
              </label>
              <p className="mt-1 text-sm text-gray-500">Inactive announcements won't be visible to users</p>
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
              disabled={!watch("target_students") && !watch("target_teachers") && !watch("target_parents")}
              className="px-5 py-2.5 text-sm font-medium text-white bg-josseypink1 rounded-lg hover:bg-josseypink2 focus:outline-none focus:ring-4 focus:ring-pink100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {type === "create" ? "Create Announcement" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;