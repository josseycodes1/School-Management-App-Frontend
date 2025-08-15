"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";
import Image from "next/image";
import { useState, useEffect } from "react";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  subject_specialization: z.string().min(1, "Specialization is required"),
  gender: z.enum(["male", "female", "other"]),
  birth_date: z.string().min(1, "Birth date is required"),
  profile_picture: z.any().optional()
});

type FormData = z.infer<typeof schema>;

const TeacherForm = ({
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

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (data) {
      reset({
        first_name: data.user?.first_name || "",
        last_name: data.user?.last_name || "",
        email: data.user?.email || "",
        phone: data.phone_number || "",
        address: data.address || "",
        subject_specialization: data.subject_specialization || "",
        gender: data.gender || "male",
        birth_date: data.birth_date?.split('T')[0] || "",
      });
      setPreviewImage(data.profile_picture || "");
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formPayload.append(key, value);
      });

      const endpoint = type === "create" 
        ? "http://localhost:8000/api/accounts/teachers/" 
        : `http://localhost:8000/api/accounts/teachers/${data?.id}/`;

      const response = await axios({
        method: type === "create" ? "post" : "put",
        url: endpoint,
        data: formPayload,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      onSuccess?.(response.data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-josseypink1 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {type === "create" ? "Add New Teacher" : "Edit Teacher Details"}
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
          <div className="mb-6 flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-pink100 overflow-hidden bg-gray-100 flex items-center justify-center">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile Preview"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <label className="absolute -bottom-2 right-0 bg-josseypink2 text-white p-1 rounded-full cursor-pointer hover:bg-josseypink1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  {...register("profile_picture")}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Upload a clear photo</p>
              <p className="text-xs text-gray-400">JPG, PNG (Max 2MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name*"
              name="first_name"
              register={register}
              error={errors.first_name}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Last Name*"
              name="last_name"
              register={register}
              error={errors.last_name}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Email*"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Phone Number*"
              name="phone"
              register={register}
              error={errors.phone}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <div className="md:col-span-2">
              <InputField
                label="Address*"
                name="address"
                register={register}
                error={errors.address}
                wrapperClassName="w-full"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
            </div>
            <InputField
              label="Subject Specialization*"
              name="subject_specialization"
              register={register}
              error={errors.subject_specialization}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Gender*</label>
              <select
                {...register("gender")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Date of Birth*</label>
              <input
                type="date"
                {...register("birth_date")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
              {errors.birth_date && (
                <p className="mt-1 text-sm text-red-600">{errors.birth_date.message}</p>
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
              className="px-5 py-2.5 text-sm font-medium text-white bg-josseypink1 rounded-lg hover:bg-josseypink2 focus:outline-none focus:ring-4 focus:ring-pink100"
            >
              {type === "create" ? "Create Teacher" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;