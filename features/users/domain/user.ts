export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  nim?: string;
  role?: 'student' | 'admin';
  is_verified: boolean;
  whatsapp_number?: string;
}
