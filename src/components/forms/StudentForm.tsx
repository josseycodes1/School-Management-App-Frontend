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
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  blood_type: z.string().min(1, "Blood type is required"),
  gender: z.enum(["male", "female", "other"]),
  birth_date: z.string().min(1, "Birth date is required"),
  admission_number: z.string().min(1, "Admission number is required"),
  class_level: z.string().min(1, "Class level is required"),
  parent_name: z.string().min(1, "Parent name is required"),
  parent_contact: z.string().min(10, "Parent contact is required"),
  profile_picture: z.any().optional()
});

type FormData = z.infer<typeof schema>;

const StudentForm = ({
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      reset({
        first_name: data.user?.first_name || "",
        last_name: data.user?.last_name || "",
        email: data.user?.email || "",
        username: data.user?.username || "",
        phone: data.phone || "",
        address: data.address || "",
        blood_type: data.blood_type || "",
        gender: data.gender || "male",
        birth_date: data.birth_date?.split('T')[0] || "",
        admission_number: data.admission_number || "",
        class_level: data.class_level || "",
        parent_name: data.parent_name || "",
        parent_contact: data.parent_contact || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formPayload.append(key, value);
        }
      });

      const endpoint = type === "create"
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/${data?.id}/`;


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
              {type === "create" ? "Add New Student" : "Edit Student Details"}
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
                <Image
                  src="/avatar.png"
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <label className="absolute -bottom-2 right-0 bg-josseypink2 text-white p-1 rounded-full cursor-pointer hover:bg-josseypink1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  {...register("profile_picture")}
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
              label="Username*"
              name="username"
              register={register}
              error={errors.username}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            {type === "create" && (
              <InputField
                label="Password*"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                wrapperClassName="w-full"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
            )}
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
              label="Blood Type*"
              name="blood_type"
              register={register}
              error={errors.blood_type}
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
            <InputField
              label="Admission Number*"
              name="admission_number"
              register={register}
              error={errors.admission_number}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Class Level*"
              name="class_level"
              register={register}
              error={errors.class_level}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Parent Name*"
              name="parent_name"
              register={register}
              error={errors.parent_name}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Parent Contact*"
              name="parent_contact"
              register={register}
              error={errors.parent_contact}
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
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-josseypink1 rounded-lg hover:bg-josseypink2 focus:outline-none focus:ring-4 focus:ring-pink100 disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {type === "create" ? "Create Student" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;