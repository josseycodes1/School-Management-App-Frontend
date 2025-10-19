// MedicalInfoForm.tsx - Updated
import { FormData } from './types';

interface MedicalInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function MedicalInfoForm({ formData, onChange, onBlur }: MedicalInfoFormProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label htmlFor="medical_notes" className="block text-sm font-medium text-gray-700">
            Medical Notes
          </label>
          <textarea
            name="medical_notes"
            id="medical_notes"
            rows={3}
            value={formData.medical_notes}
            onChange={onChange}
            onBlur={onBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
            placeholder="Any allergies, conditions, or special medical requirements"
          />
        </div>
      </div>
    </div>
  );
}