import { FormData, ProgressData } from './types';

interface PersonalInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  progress: ProgressData;
}

const bloodTypes = [
  'A+', 'A-', 'B+', 'B-', 
  'AB+', 'AB-', 'O+', 'O-'
];

export default function PersonalInfoForm({ formData, onChange, progress }: PersonalInfoFormProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        {/* Phone */}
        <div className={`sm:col-span-3 ${!progress.required_fields.phone && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
            required
          />
        </div>

        {/* Gender */}
        <div className={`sm:col-span-3 ${!progress.required_fields.gender && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
            required
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        {/* Address */}
        <div className={`sm:col-span-6 ${!progress.required_fields.address && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
            required
          />
        </div>

        {/* Birth Date */}
        <div className={`sm:col-span-3 ${!progress.required_fields.birth_date && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={onChange}
            className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
            required
          />
        </div>

        {/* Blood Type */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={onChange}
            className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
          >
            <option value="">Select blood type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}