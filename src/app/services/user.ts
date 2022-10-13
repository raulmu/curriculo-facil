export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  curriculosUID?: string | null;
  loginMode?: 'google-oauth' | 'email-password';
  querAssinar?: boolean;
}
