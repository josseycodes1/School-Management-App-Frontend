"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  start_date: z.string().min(1, "Date is required"),
  audiences: z.array(z.string()).min(1, "At least one audience is required"),
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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data || {
      title: "",
      message: "",
      start_date: "",
      audiences: []
    }
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const endpoint = type === "create" 
        ? "http://localhost:8000/api/announcements/" 
        : `http://localhost:8000/api/announcements/${data?.id}/`;

      const method = type === "create" ? "post" : "put";

      const response = await axios({
        method,
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {type === "create" ? "Create Announcement" : "Edit Announcement"}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <InputField
          label="Title*"
          name="title"
          register={register}
          error={errors.title}
        />
        
        {/* Message Field (as textarea) */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message*
          </label>
          <textarea
            {...register("message")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-josseypink2 focus:border-josseypink2"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* Date Field */}
        <InputField
          label="Date*"
          name="start_date"
          type="date"
          register={register}
          error={errors.start_date}
        />
        
        {/* Audience Selection */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audience*
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register("audiences")}
                value="students"
                className="rounded border-gray-300 text-josseypink1 focus:ring-josseypink2"
              />
              <span className="ml-2">Students</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register("audiences")}
                value="teachers"
                className="rounded border-gray-300 text-josseypink1 focus:ring-josseypink2"
              />
              <span className="ml-2">Teachers</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register("audiences")}
                value="parents"
                className="rounded border-gray-300 text-josseypink1 focus:ring-josseypink2"
              />
              <span className="ml-2">Parents</span>
            </label>
          </div>
          {errors.audiences && (
            <p className="mt-1 text-sm text-red-600">{errors.audiences.message}</p>
          )}
        </div>
        
        {/* Form Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2"
          >
            {type === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;