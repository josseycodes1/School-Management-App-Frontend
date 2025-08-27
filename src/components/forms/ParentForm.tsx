"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";
import { useState, useEffect } from "react";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  emergency_contact: z.string().min(10, "Emergency contact is required"),
  occupation: z.string().min(1, "Occupation is required"),
});

type FormData = z.infer<typeof schema>;

const ParentForm = ({
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
        emergency_contact: data.emergency_contact || "",
        occupation: data.occupation || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        user: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          username: formData.username,
          ...(type === "create" && { password: formData.password }),
        },
        phone: formData.phone,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        occupation: formData.occupation,
      };

      const endpoint = type === "create"
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/${data?.id}/`;


      const method = type === "create" ? "post" : "put";

      const response = await axios({
        method,
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
              {type === "create" ? "Add New Parent" : "Edit Parent Details"}
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
            <InputField
              label="Emergency Contact*"
              name="emergency_contact"
              register={register}
              error={errors.emergency_contact}
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
              label="Occupation*"
              name="occupation"
              register={register}
              error={errors.occupation}
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
              {type === "create" ? "Create Parent" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentForm;