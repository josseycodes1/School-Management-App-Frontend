import { FormData, ProgressData } from './types';

interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  emergency_contact?: string;
  photo?: string;
  [key: string]: string | undefined;
}

interface EmergencyInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: ValidationErrors;
  getFieldError: (fieldName: string) => string | undefined;
  progress: ProgressData;
}

export default function EmergencyInfoForm({ 
  formData, 
  onChange, 
  onBlur,
  errors,
  getFieldError,
  progress 
}: EmergencyInfoFormProps) {
  
  const getInputClass = (fieldName: string) => {
    const baseClass = "mt-1 block w-full rounded-md shadow-sm focus:ring-[#FC46AA] sm:text-sm p-2 border";
    const error = getFieldError(fieldName);
    
    if (error) {
      return `${baseClass} border-red-300 focus:border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300 focus:border-[#FC46AA]`;
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Information</h2>
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        {/* Emergency Contact */}
        <div className={`sm:col-span-3 ${getFieldError('emergency_contact') && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
          <input
            type="tel"
            name="emergency_contact"
            value={formData.emergency_contact}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('emergency_contact')}
            placeholder="e.g., 123-456-7890"
            required
          />
          {getFieldError('emergency_contact') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('emergency_contact')}</p>
          )}
          {!getFieldError('emergency_contact') && formData.emergency_contact && (
            <p className="mt-1 text-sm text-blue-600">✓ Valid emergency contact</p>
          )}
        </div>

        {/* Occupation */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={onChange}
            onBlur={onBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-josseypink1 focus:ring-josseypink1 sm:text-sm p-2 border"
            placeholder="Your profession"
          />
          {formData.occupation && (
            <p className="mt-1 text-sm text-blue-600">✓ Occupation added</p>
          )}
        </div>
      </div>
    </div>
  );
}