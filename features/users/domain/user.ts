export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  whatsapp_number?: string;
}
