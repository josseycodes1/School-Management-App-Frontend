"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional(),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(10, { message: "Phone must be at least 10 digits!" }),
  address: z.string().min(5, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthDate: z.string().min(1, { message: "Birthday is required!" }),
  gender: z.enum(["M", "F", "O", "N"], { message: "Gender is required!" }),
  admissionNumber: z.string().min(1, { message: "Admission number is required!" }),
  classLevel: z.string().min(1, { message: "Class level is required!" }),
  parentName: z.string().min(1, { message: "Parent/Guardian name is required!" }),
  parentContact: z.string().min(10, { message: "Parent contact is required!" }),
  profilePhoto: z.instanceof(FileList).optional(),
});

type Inputs = z.infer<typeof schema>;

interface StudentFormProps {
  type: "create" | "update";
  data?: any;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
}

interface StudentProfile {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
  admission_number: string;
  phone: string;
  address: string;
  gender: string;
  birth_date: string | null;
  photo: string;
  class_level: string;
  parent_name: string;
  parent_contact: string;
  academic_year: string;
  medical_notes: string;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

const StudentForm = ({
  type,
  data,
  onSuccess,
  onClose,
}: StudentFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
      firstName: data?.user?.first_name,
      lastName: data?.user?.last_name,
      email: data?.user?.email,
      username: data?.user?.username,
      birthDate: data?.birth_date?.split('T')[0]
    }
  });

  useEffect(() => {
    if (data?.photo) {
      setPreviewImage(data.photo);
    }
  }, [data]);

  const profilePhoto = watch("profilePhoto");

  useEffect(() => {
    if (profilePhoto?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(profilePhoto[0]);
    }
  }, [profilePhoto]);

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        
        if (key === "profilePhoto" && value instanceof FileList && value[0]) {
          formPayload.append(key, value[0]);
        } else if (typeof value === 'string' || value instanceof Blob) {
          formPayload.append(key, value);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          formPayload.append(key, String(value));
        } else if (typeof value === 'object') {
          formPayload.append(key, String(value));
        }
      });

      const endpoint = type === "create" 
        ? "http://localhost:8000/api/accounts/students/" 
        : `http://localhost:8000/api/accounts/students/${data?.id}/`;

      const method = type === "create" ? "POST" : "PUT";

      const response: AxiosResponse<StudentProfile> = await axios({
        method,
        url: endpoint,
        data: formPayload,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      onSuccess?.(response.data);
      reset();
      onClose?.();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const fileList = e.target.files;
      setValue("profilePhoto", fileList);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={onSubmit} className="p-6">
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
                    unoptimized={previewImage.startsWith('blob:')}
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
                  accept="image/*"
                  onChange={handleImageChange}
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
              label="Username*"
              name="username"
              register={register}
              error={errors.username}
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
              label="First Name*"
              name="firstName"
              register={register}
              error={errors.firstName}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Last Name*"
              name="lastName"
              register={register}
              error={errors.lastName}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Phone*"
              name="phone"
              register={register}
              error={errors.phone}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Address*"
              name="address"
              register={register}
              error={errors.address}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Blood Type*"
              name="bloodType"
              register={register}
              error={errors.bloodType}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Birth Date*</label>
              <input
                type="date"
                {...register("birthDate")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900">Gender*</label>
              <select
                {...register("gender")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
                <option value="N">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            <InputField
              label="Admission Number*"
              name="admissionNumber"
              register={register}
              error={errors.admissionNumber}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Class Level*"
              name="classLevel"
              register={register}
              error={errors.classLevel}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />

            <InputField
              label="Parent/Guardian Name*"
              name="parentName"
              register={register}
              error={errors.parentName}
              wrapperClassName="w-full"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-josseypink2 focus:border-josseypink2 block w-full p-2.5"
            />
            <InputField
              label="Parent/Guardian Contact*"
              name="parentContact"
              register={register}
              error={errors.parentContact}
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