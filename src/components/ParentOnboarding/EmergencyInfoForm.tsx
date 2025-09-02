import { FormData, ProgressData } from './types';

interface EmergencyInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  progress: ProgressData;
}

export default function EmergencyInfoForm({ formData, onChange, progress }: EmergencyInfoFormProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Information</h2>
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        {/* Emergency Contact */}
        <div className={`sm:col-span-3 ${!progress.required_fields.emergency_contact && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
          <input
            type="tel"
            name="emergency_contact"
            value={formData.emergency_contact}
            onChange={onChange}
            className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
            required
          />
        </div>

        {/* Occupation */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={onChange}
            className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
          />
        </div>
      </div>
    </div>
  );
}