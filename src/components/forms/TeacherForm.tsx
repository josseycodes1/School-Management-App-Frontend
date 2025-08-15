"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import InputField from "@/components/InputField";
import Image from "next/image";
import { useState } from "react";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be 8+ characters").optional(),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().min(1, "Phone required"),
  address: z.string().min(1, "Address required"),
  bloodType: z.string().min(1, "Blood type required"),
  birthday: z.string().min(1, "Birthday required"),
  sex: z.enum(["male", "female"]),
  img: z.instanceof(File).optional()
});

type Inputs = z.infer<typeof schema>;

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
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data || { sex: "male" }
  });

  const [preview, setPreview] = useState(data?.imgUrl || "");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("img", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData: Inputs) => {
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
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      onSuccess?.(response.data);
      onClose?.();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <h2 className="text-xl font-bold">
        {type === "create" ? "Add Teacher" : "Edit Teacher"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Username" name="username" register={register} error={errors.username} />
        <InputField label="Email" name="email" register={register} error={errors.email} />
        {type === "create" && (
          <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
        )}
        <InputField label="First Name" name="firstName" register={register} error={errors.firstName} />
        <InputField label="Last Name" name="lastName" register={register} error={errors.lastName} />
        <InputField label="Phone" name="phone" register={register} error={errors.phone} />
        <InputField label="Address" name="address" register={register} error={errors.address} />
        <InputField label="Blood Type" name="bloodType" register={register} error={errors.bloodType} />
        <InputField label="Birthday" name="birthday" type="date" register={register} error={errors.birthday} />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Gender</label>
          <select {...register("sex")} className="w-full p-2 border rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex && <p className="text-red-500 text-xs">{errors.sex.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Photo</label>
          <div className="flex items-center gap-3">
            {preview && (
              <Image src={preview} alt="Preview" width={50} height={50} className="rounded-full" />
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <Image src="/upload.png" alt="" width={20} height={20} />
              <span>Upload</span>
              <input type="file" className="hidden" onChange={handleImage} />
            </label>
          </div>
          {errors.img && <p className="text-red-500 text-xs">{errors.img.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-4 py-2 bg-josseypink1 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : type === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;