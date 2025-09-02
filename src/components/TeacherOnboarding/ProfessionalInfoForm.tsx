'use client';

interface FormData {
  phone: string;
  address: string;
  gender: string;
  birth_date: string;
  blood_type: string;
  subject_specialization: string;
  hire_date: string;
  qualifications: string;
  photo: File | null;
}

interface ProgressData {
  completed: boolean;
  progress: number;
  required_fields: {
    phone: boolean;
    address: boolean;
    gender: boolean;
    birth_date: boolean;
    subject_specialization: boolean;
    hire_date: boolean;
    photo: boolean;
  };
}

interface ProfessionalInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  progress: ProgressData;
}

export default function ProfessionalInfoForm({ formData, onChange, progress }: ProfessionalInfoFormProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        <div className={`sm:col-span-6 ${!progress.required_fields.subject_specialization && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="subject_specialization" className="block text-sm font-medium text-gray-700">
            Subject Specialization *
          </label>
          <input
            type="text"
            name="subject_specialization"
            id="subject_specialization"
            value={formData.subject_specialization}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
            required
          />
        </div>

        <div className={`sm:col-span-3 ${!progress.required_fields.hire_date && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">
            Hire Date *
          </label>
          <input
            type="date"
            name="hire_date"
            id="hire_date"
            value={formData.hire_date}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
            required
          />
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
            Qualifications
          </label>
          <textarea
            name="qualifications"
            id="qualifications"
            rows={3}
            value={formData.qualifications}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
            placeholder="List your educational qualifications and certifications"
          />
        </div>
      </div>
    </div>
  );
}