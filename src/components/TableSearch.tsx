"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TableSearch = ({ value, onChange, placeholder = "Search..." }: TableSearchProps) => {
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optional: Update URL when form is explicitly submitted
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <Image src="/search.png" alt="Search icon" width={14} height={14} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;


// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { ChangeEvent, useState, useEffect } from "react";

// interface TableSearchProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// const TableSearch = ({ value, onChange, placeholder = "Search..." }: TableSearchProps) => {
//   const router = useRouter();
//   const [localValue, setLocalValue] = useState(value);

//   // Sync local value with prop value
//   useEffect(() => {
//     setLocalValue(value);
//   }, [value]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value;
//     setLocalValue(newValue);
//     onChange(newValue);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Only update URL when form is explicitly submitted
//     const params = new URLSearchParams(window.location.search);
//     if (localValue.trim()) {
//       params.set("search", localValue.trim());
//     } else {
//       params.delete("search");
//     }
//     router.push(`${window.location.pathname}?${params}`);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
//     >
//       <Image src="/search.png" alt="Search icon" width={14} height={14} />
//       <input
//         type="text"
//         value={localValue}
//         onChange={handleChange}
//         placeholder={placeholder}
//         className="w-[200px] p-2 bg-transparent outline-none"
//       />
//     </form>
//   );
// };

// export default TableSearch;