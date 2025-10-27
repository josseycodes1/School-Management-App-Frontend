'use client';

interface ProgressData {
  completed: boolean;
  progress: number;
  required_fields: {
    phone: boolean;
    address: boolean;
    gender: boolean;
    birth_date: boolean;
    admission_number: boolean;
    class_level: boolean;
    photo: boolean;
    parent_name: boolean;
    parent_contact: boolean;
  };
}

interface ProgressHeaderProps {
  progress: ProgressData;
}

export default function ProgressHeader({ progress }: ProgressHeaderProps) {
  return (
    <div className="bg-josseypink1 py-4 px-6 text-white">
      <h1 className="text-2xl font-bold text-center">Student Onboarding</h1>
      <div className="mt-2">
        <div className="flex justify-between text-sm">
          <span>Progress: {progress.progress}%</span>
          <span>
            {Object.values(progress.required_fields).filter(Boolean).length}/
            {Object.keys(progress.required_fields).length} completed
          </span>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-1">
          <div 
            className="bg-white h-2 rounded-full" 
            style={{ width: `${progress.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}