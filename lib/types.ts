export interface User {
  id: string;
  initials: string;
  hasPendingReceipts: boolean;
  lastLogin: string;
  isSuperuser: boolean;
  username: string;
  firstName: string;
  lastName: string;
  nationality: string;
  email: string;
  fullName: string;
  role: string;
  dateJoined: string; 
  createdAt: string; 
  modifiedAt: string; 
  address: string;
  phoneNumber: string;
  employeeNumber: number;
  requiredPasswordChange: boolean;
}

export interface LoginResponse {
  token: string;
  user: User; 
}
