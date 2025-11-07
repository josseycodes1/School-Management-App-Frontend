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

interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  subject_specialization?: string;
  hire_date?: string;
  photo?: string;
  [key: string]: string | undefined;
}

interface ProfessionalInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: ValidationErrors;
  getFieldError: (fieldName: string) => string | undefined;
  progress: ProgressData;
}

export default function ProfessionalInfoForm({ 
  formData, 
  onChange, 
  onBlur,
  errors,
  getFieldError,
  progress 
}: ProfessionalInfoFormProps) {
  
  const getInputClass = (fieldName: string) => {
    const baseClass = "mt-1 block w-full rounded-md shadow-sm focus:ring-josseypink1 sm:text-sm p-2 border";
    const error = getFieldError(fieldName);
    
    if (error) {
      return `${baseClass} border-red-300 focus:border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300 focus:border-josseypink1`;
  };

  const getTextareaClass = (fieldName: string) => {
    const baseClass = "mt-1 block w-full rounded-md shadow-sm focus:ring-josseypink1 sm:text-sm p-2 border";
    const error = getFieldError(fieldName);
    
    if (error) {
      return `${baseClass} border-red-300 focus:border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300 focus:border-josseypink1`;
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        {/* Subject Specialization */}
        <div className={`sm:col-span-6 ${getFieldError('subject_specialization') && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="subject_specialization" className="block text-sm font-medium text-gray-700">
            Subject Specialization *
          </label>
          <input
            type="text"
            name="subject_specialization"
            id="subject_specialization"
            value={formData.subject_specialization}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('subject_specialization')}
            placeholder="e.g., Mathematics, Science, English"
            required
          />
          {getFieldError('subject_specialization') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('subject_specialization')}</p>
          )}
          {!getFieldError('subject_specialization') && formData.subject_specialization && (
            <p className="mt-1 text-sm text-josseypink1">✓ Subject specialization entered</p>
          )}
        </div>

        {/* Hire Date */}
        <div className={`sm:col-span-3 ${getFieldError('hire_date') && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">
            Hire Date *
          </label>
          <input
            type="date"
            name="hire_date"
            id="hire_date"
            value={formData.hire_date}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('hire_date')}
            required
          />
          {getFieldError('hire_date') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('hire_date')}</p>
          )}
          {!getFieldError('hire_date') && formData.hire_date && (
            <p className="mt-1 text-sm text-josseypink1">✓ Valid hire date</p>
          )}
        </div>

        {/* Qualifications */}
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
            onBlur={onBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-josseypink1 focus:ring-josseypink10 sm:text-sm p-2 border"
            placeholder="List your educational qualifications, certifications, and relevant training"
          />
          {formData.qualifications && (
            <p className="mt-1 text-sm text-josseypink1">
              ✓ {formData.qualifications.split(/\r\n|\r|\n/).filter(line => line.trim()).length} qualification(s) entered
            </p>
          )}
        </div>
      </div>
    </div>
  );
}