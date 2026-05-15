export interface CurrentUser {
  id: number;
  name: string;
  is_verified: boolean;
  whatsapp_number?: string;
}
