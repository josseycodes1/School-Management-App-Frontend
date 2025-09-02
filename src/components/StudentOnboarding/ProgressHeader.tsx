interface ProgressProps {
  progress: { progress: number; required_fields: Record<string, boolean>; completed: boolean };
}

export default function ProgressHeader({ progress }: ProgressProps) {
  return (
    <div className="bg-[#FC46AA] py-4 px-6">
      <h1 className="text-2xl font-bold text-center text-white">Student Onboarding</h1>
      <div className="mt-2">
        <div className="flex justify-between text-sm text-white">
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
          />
        </div>
      </div>
    </div>
  );
}
