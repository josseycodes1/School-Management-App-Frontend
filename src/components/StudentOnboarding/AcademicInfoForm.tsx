import { FormData, ProgressData } from './types';

interface AcademicInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  progress: ProgressData;
}

const classLevels = [
  'JSS1', 'JSS2', 'JSS3',
  'SSS1', 'SSS2', 'SSS3'
];

export default function AcademicInfoForm({ formData, onChange, progress }: AcademicInfoFormProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        <div className={`sm:col-span-3 ${!progress.required_fields.admission_number && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="admission_number" className="block text-sm font-medium text-gray-700">
            Admission Number *
          </label>
          <input
            type="text"
            name="admission_number"
            id="admission_number"
            value={formData.admission_number}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border bg-gray-100 cursor-not-allowed"
            readOnly
          />
          <p className="text-sm text-gray-500 mt-1">
            Your admission number will be automatically generated once you submit this form.
          </p>
        </div>

        <div className={`sm:col-span-3 ${!progress.required_fields.class_level && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="class_level" className="block text-sm font-medium text-gray-700">
            Class Level *
          </label>
          <select
            id="class_level"
            name="class_level"
            value={formData.class_level}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
            required
          >
            <option value="">Select class</option>
            {classLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}