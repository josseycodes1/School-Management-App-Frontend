import { useState, ReactNode } from 'react';

// Define types for the step configuration
interface Step {
  name: string;
  component: React.ComponentType<StepComponentProps>;
}

// Define props for step components
interface StepComponentProps {
  data: any;
  onNext: (stepData: any) => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
}

// Define props for OnboardingLayout
interface OnboardingLayoutProps {
  role: string;
  steps: Step[];
  onSubmit: (formData: any) => void;
}

export default function OnboardingLayout({ role, steps, onSubmit }: OnboardingLayoutProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (stepData: any) => {
    setFormData({ ...formData, ...stepData });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const CurrentStep = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-[#F699CD] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center 
                  ${i <= currentStep ? 'bg-[#FC46AA] text-white' : 'bg-gray-200'}`}
              >
                {i + 1}
              </div>
              <p className="text-xs mt-2">{step.name}</p>
            </div>
          ))}
        </div>

        {/* Current Step */}
        <CurrentStep
          data={formData}
          onNext={handleNext}
          onPrev={handlePrev}
          isLastStep={currentStep === steps.length - 1}
          onSubmit={() => onSubmit(formData)}
        />
      </div>
    </div>
  );
}