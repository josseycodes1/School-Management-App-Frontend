import { FormData, ProgressData } from './types';

interface ParentInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  progress: ProgressData;
}

export default function ParentInfoForm({ formData, onChange, progress }: ParentInfoFormProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        <div className={`sm:col-span-3 ${!progress.required_fields.parent_name && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
            Parent/Guardian Name *
          </label>
          <input
            type="text"
            name="parent_name"
            id="parent_name"
            value={formData.parent_name}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
            required
          />
        </div>

        <div className={`sm:col-span-3 ${!progress.required_fields.parent_contact && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="parent_contact" className="block text-sm font-medium text-gray-700">
            Parent/Guardian Contact *
          </label>
          <input
            type="tel"
            name="parent_contact"
            id="parent_contact"
            value={formData.parent_contact}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
            required
          />
        </div>
      </div>
    </div>
  );
}