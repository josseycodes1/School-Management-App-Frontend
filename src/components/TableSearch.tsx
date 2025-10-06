"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void; // New prop for API search
  placeholder?: string;
}

const TableSearch = ({ value, onChange, onSubmit, placeholder = "Search..." }: TableSearchProps) => {
  const router = useRouter();
  const [localValue, setLocalValue] = useState(value);

  // Keep localValue in sync with external changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue); // Live update for client-side search
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(); // Trigger API search
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(); // Trigger API search on Enter
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <Image src="/search.png" alt="Search icon" width={14} height={14} />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
      {/* Optional: Add a subtle indicator */}
      <button 
        type="submit" 
        className="text-xs text-gray-400 hover:text-josseypink1 transition-colors"
        title="Press Enter to search all data"
      >
        ↵
      </button>
    </form>
  );
};

export default TableSearch;