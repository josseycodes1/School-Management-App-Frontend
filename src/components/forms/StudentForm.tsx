"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState } from "react";
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

  const profilePhoto = watch("profilePhoto");

  // Handle image preview
  if (profilePhoto?.[0] && !previewImage) {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(profilePhoto[0]);
  }

const onSubmit = handleSubmit(async (formData) => {
  setIsSubmitting(true);
  try {
    const formPayload = new FormData();
    
    // Append all form data with proper type checking
    Object.entries(formData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (key === "profilePhoto" && value instanceof FileList && value[0]) {
        formPayload.append(key, value[0]);
      } else if (typeof value === 'string' || value instanceof Blob) {
        formPayload.append(key, value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        formPayload.append(key, String(value));  // Use String() instead of toString()
      } else if (typeof value === 'object') {
        // Handle case where value might be an object (like for dates)
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

  return (
    <div className="bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold text-josseypink1 mb-6">
        {type === "create" ? "Add New Student" : "Edit Student"}
      </h1>
      
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        {/* Section Headers */}
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-lg font-semibold text-gray-700">Authentication Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Username*"
            name="username"
            register={register}
            error={errors.username}
            placeholder="johndoe123"
          />
          <InputField
            label="Email*"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="student@school.edu"
          />
          {type === "create" && (
            <InputField
              label="Password*"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
            />
          )}
        </div>

        <div className="border-b border-gray-200 pb-2 mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="First Name*"
            name="firstName"
            register={register}
            error={errors.firstName}
            placeholder="John"
          />
          <InputField
            label="Last Name*"
            name="lastName"
            register={register}
            error={errors.lastName}
            placeholder="Doe"
          />
          <InputField
            label="Phone*"
            name="phone"
            register={register}
            error={errors.phone}
            placeholder="+1234567890"
          />
          <InputField
            label="Address*"
            name="address"
            register={register}
            error={errors.address}
            placeholder="123 Main St"
          />
          <InputField
            label="Blood Type*"
            name="bloodType"
            register={register}
            error={errors.bloodType}
            placeholder="A+"
          />
          <InputField
            label="Birth Date*"
            name="birthDate"
            type="date"
            register={register}
            error={errors.birthDate}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Gender*</label>
            <select
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-josseypink1 focus:border-transparent"
              {...register("gender")}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
              <option value="N">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 pb-2 mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Academic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Admission Number*"
            name="admissionNumber"
            register={register}
            error={errors.admissionNumber}
            placeholder="20230001"
          />
          <InputField
            label="Class Level*"
            name="classLevel"
            register={register}
            error={errors.classLevel}
            placeholder="Grade 10"
          />
        </div>

        <div className="border-b border-gray-200 pb-2 mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Parent/Guardian Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Parent/Guardian Name*"
            name="parentName"
            register={register}
            error={errors.parentName}
            placeholder="Jane Doe"
          />
          <InputField
            label="Parent/Guardian Contact*"
            name="parentContact"
            register={register}
            error={errors.parentContact}
            placeholder="+1234567890"
          />
        </div>

        <div className="border-b border-gray-200 pb-2 mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Profile Photo</h2>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-josseypink1">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Profile preview"
                fill
                className="object-cover"
              />
            ) : data?.photo ? (
              <Image
                src={data.photo}
                alt="Current profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-josseypink1 text-white px-4 py-2 rounded-lg hover:bg-josseypink2 transition-colors">
            Upload Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              {...register("profilePhoto")}
            />
          </label>
          {errors.profilePhoto && (
            <p className="text-xs text-red-500">{errors.profilePhoto.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2 disabled:bg-gray-400 flex items-center gap-2"
          >
            {isSubmitting && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {type === "create" ? "Create Student" : "Update Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;