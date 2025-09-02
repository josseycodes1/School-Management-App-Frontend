export interface FormData {
  phone: string;
  address: string;
  gender: string;
  birth_date: string;
  emergency_contact: string;
  occupation: string;
  blood_type: string;
  photo: File | null;
}

export interface ProgressData {
  completed: boolean;
  progress: number;
  required_fields: {
    phone: boolean;
    address: boolean;
    gender: boolean;
    birth_date: boolean;
    emergency_contact: boolean;
    photo: boolean;
  };
}