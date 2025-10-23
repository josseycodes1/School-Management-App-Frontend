import { FormData, ProgressData } from './types';

interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  admission_number?: string;
  class_level?: string;
  photo?: string;
  parent_name?: string;
  parent_contact?: string;
  [key: string]: string | undefined;
}

interface ParentInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: ValidationErrors;
  getFieldError: (fieldName: string) => string | undefined;
  progress: ProgressData;
}

export default function ParentInfoForm({ 
  formData, 
  onChange, 
  onBlur,
  errors,
  getFieldError,
  progress 
}: ParentInfoFormProps) {
  
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
      <h2 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        {/* Parent Name */}
        <div className={`sm:col-span-3 ${getFieldError('parent_name') && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
            Parent/Guardian Name *
          </label>
          <input
            type="text"
            name="parent_name"
            id="parent_name"
            value={formData.parent_name}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('parent_name')}
            placeholder="Enter parent/guardian full name"
            required
          />
          {getFieldError('parent_name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('parent_name')}</p>
          )}
          {!getFieldError('parent_name') && formData.parent_name && (
            <p className="mt-1 text-sm text-green-600">✓ Valid parent name</p>
          )}
        </div>

        {/* Parent Contact */}
        <div className={`sm:col-span-3 ${getFieldError('parent_contact') && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="parent_contact" className="block text-sm font-medium text-gray-700">
            Parent/Guardian Contact *
          </label>
          <input
            type="tel"
            name="parent_contact"
            id="parent_contact"
            value={formData.parent_contact}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('parent_contact')}
            placeholder="e.g., 123-456-7890"
            required
          />
          {getFieldError('parent_contact') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('parent_contact')}</p>
          )}
          {!getFieldError('parent_contact') && formData.parent_contact && (
            <p className="mt-1 text-sm text-green-600">✓ Valid contact number</p>
          )}
        </div>
      </div>
    </div>
  );
}