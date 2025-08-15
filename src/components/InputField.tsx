"use client";

import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: UseFormRegister<any> | any; // More flexible type
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string; // Added className prop
  wrapperClassName?: string; // Added for wrapper div
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className = "", // Input field className
  wrapperClassName = "flex flex-col gap-2 w-full md:w-1/4" // Default wrapper style
}: InputFieldProps) => {
  return (
    <div className={wrapperClassName}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className={`ring-[1.5px] ring-gray-300 bg-pink-100 p-2 rounded-md text-sm w-full ${className}`}
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;