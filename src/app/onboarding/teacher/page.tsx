'use client'
import { useState, ChangeEvent } from 'react';
import OnboardingLayout from '../../../components/OnboardingLayout';

interface TeacherFormData {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  subject_specialization?: string;
  hire_date?: string;
  qualifications?: string;
  photo?: File | null;
}

interface StepProps {
  data: TeacherFormData;
  onNext: (data: Partial<TeacherFormData>) => void;
  onPrev?: () => void;
  onSubmit?: (data: FormData) => void;
  isLastStep?: boolean;
}

function PersonalInfo({ data, onNext }: StepProps) {
  const [form, setForm] = useState<TeacherFormData>(data);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#FC46AA] mb-6">Personal Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={form.address || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={form.gender || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => onNext(form)}
        className="mt-6 w-full bg-[#FC46AA] text-white py-2 rounded-lg"
      >
        Next
      </button>
    </div>
  );
}

function ProfessionalInfo({ data, onNext, onPrev }: StepProps) {
  const [form, setForm] = useState<TeacherFormData>(data);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#FC46AA] mb-6">Professional Info</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Subject Specialization</label>
          <input
            type="text"
            name="subject_specialization"
            value={form.subject_specialization || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Hire Date</label>
          <input
            type="date"
            name="hire_date"
            value={form.hire_date || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Qualifications</label>
          <textarea
            name="qualifications"
            value={form.qualifications || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="px-4 py-2 border rounded-lg">
          Back
        </button>
        <button
          onClick={() => onNext(form)}
          className="px-4 py-2 bg-[#FC46AA] text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function UploadPhoto({ data, onSubmit }: StepProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      alert('Please select a profile photo');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'photo') {
        formData.append(key, value as string);
      }
    });

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#FC46AA] mb-6">Profile Photo</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full mb-6"
        required
        accept="image/*"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-[#FC46AA] text-white py-2 rounded-lg"
      >
        Complete Onboarding
      </button>
    </div>
  );
}

export default function TeacherOnboarding() {
  const steps = [
    { name: 'Personal', component: PersonalInfo },
    { name: 'Professional', component: ProfessionalInfo },
    { name: 'Photo', component: UploadPhoto },
  ];

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/teachers/onboarding/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        window.location.href = '/teacher';
      } else {
        const errorData = await response.json();
        console.error('Onboarding failed:', errorData);
        alert(`Onboarding failed: ${errorData.message || 'Please check your data'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return <OnboardingLayout role="teacher" steps={steps} onSubmit={handleSubmit} />;
}