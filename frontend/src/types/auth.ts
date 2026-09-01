export interface User {
  id: number;
  name: string;
  email: string;
  role: 'practitioner' | 'admin';
  registration_no?: string;
  clinic_name?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user_id: number;
  name: string;
  email: string;
  role: 'practitioner' | 'admin';
  registration_no?: string;
  clinic_name?: string;
}
