export interface FormData {
  phone: string;
  address: string;
  gender: string;
  birth_date: string;
  blood_type: string;
  admission_number: string;
  class_level: string;
  photo: File | null;
  medical_notes: string;
  parent_name: string;
  parent_contact: string;
}

export interface ProgressData {
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

export interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  parent_name?: string;
  parent_contact?: string;
  class_level?: string;
  photo?: string;
  [key: string]: string | undefined;
}

export interface ProgressData {
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
  // ADD THIS FOR BACKEND VALIDATION ERRORS
  validation_errors?: ValidationErrors;
}