// components/MobileSearch.tsx
"use client";

import Image from "next/image";
import { ChangeEvent } from "react";

interface MobileSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
}

const MobileSearch = ({ value, onChange, onClose, placeholder = "Search..." }: MobileSearchProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose(); // Close the modal after search
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-3 text-sm rounded-lg ring-2 ring-gray-300 px-3 py-2 bg-white">
        <Image src="/search.png" alt="Search icon" width={16} height={16} className="text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full p-1 bg-transparent outline-none text-gray-700"
          autoFocus
        />
        {value && (
          <button 
            type="button"
            onClick={() => onChange('')}
            className="text-gray-400 hover:text-gray-600"
          >
            <Image src="/close.png" alt="Clear" width={16} height={16} />
          </button>
        )}
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default MobileSearch;