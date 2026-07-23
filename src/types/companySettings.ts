export type ThemeMode = "light" | "dark" | "system";

export interface CompanySettings {
  theme: ThemeMode;
  logoAttachmentId?: string;
  name: string;
  phone?: string;
  email?: string;
  instagram?: string;
  whatsapp?: string;
  address?: string;
  primaryColor: string;
  currency: string;
  language: string;
}
