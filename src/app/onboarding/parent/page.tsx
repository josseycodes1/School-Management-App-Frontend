'use client'
import { useState, ChangeEvent } from 'react';
import OnboardingLayout from '../../../components/OnboardingLayout';

interface ParentFormData {
  phone?: string;
  address?: string;
  birth_date?: string;
  emergency_contact?: string;
  occupation?: string;
  blood_type?: string;
  photo?: File | null;
}

interface StepProps {
  data: ParentFormData;
  onNext: (data: Partial<ParentFormData>) => void;
  onPrev?: () => void;
  onSubmit?: (data: FormData) => void;
  isLastStep?: boolean;
}

function PersonalInfo({ data, onNext }: StepProps) {
  const [form, setForm] = useState<ParentFormData>(data);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
          <label className="block text-gray-700">Birth Date</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
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

function EmergencyInfo({ data, onNext, onPrev }: StepProps) {
  const [form, setForm] = useState<ParentFormData>(data);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#FC46AA] mb-6">Emergency Info</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Emergency Contact</label>
          <input
            type="tel"
            name="emergency_contact"
            value={form.emergency_contact || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={form.occupation || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Blood Type</label>
          <select
            name="blood_type"
            value={form.blood_type || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
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

export default function ParentOnboarding() {
  const steps = [
    { name: 'Personal', component: PersonalInfo },
    { name: 'Emergency', component: EmergencyInfo },
    { name: 'Photo', component: UploadPhoto },
  ];

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/parents/onboarding/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        window.location.href = '/parent';
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

  return <OnboardingLayout role="parent" steps={steps} onSubmit={handleSubmit} />;
}