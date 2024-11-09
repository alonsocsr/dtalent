import axios from 'axios';
import { LoginResponse, User } from './types';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 100000, 
  headers: {
    'Content-Type': 'application/json',
  }
});



interface LoginCredentials {
  username: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/users/demo_login/', credentials);
    return response.data;
  } catch (error) {
    console.log('Error al iniciar sesión:', error);
    throw error;
  }
};

interface FetchUsersParams {
  url: string;
  token: string;
}

interface FetchUsersResponse {
  results: User[];
  numPages: number;
  totalCount: number;
  next: string | null;
  previous: string | null;
  count: number | null;
  fullFilterIds: [ ];
}


export const fetchUsers = async ({
  token = '',
  url = '', 
}: FetchUsersParams): Promise<FetchUsersResponse> => {

  console.log(url)
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    console.log("success");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log("Error al obtener la lista de empleados:", error);
    throw error;
  }
};

interface FetchReceiptsParams {
  url: string;
  token: string;    
  year?: number;  
}

interface Receipt {
  id: string;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
  fullDate: string;
  year: number;
  month: number;
  type: string;
  isSended: boolean;
  isReaded: boolean;
  isSigned: boolean;
  sendedDate: string;
  readedDate: string;
  signedDate: string | null;
  employee: string;
  employeeFullName: string;
  employeeNumber: string;
}

interface FetchReceiptsResponse {
  results: Receipt[];
  numPages: number;
  totalCount: number;
  perPage: number;
  next: string | null;
  previous: string | null;
  count: number | null;
  fullFilterIds: string[];
}


export const fetchReceipts = async ({
  url,
  token,
  year,
}: FetchReceiptsParams): Promise<FetchReceiptsResponse> => {

  console.log(url)

  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        year: year ?? new Date().getFullYear(),
      },
    });
    console.log("success receipts")
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching receipts:", error);
    throw error;
  }
};

interface FetchReceiptFileParams {
  id: string;
  token: string;
}

interface FetchReceiptFileResponse {
  file: string;
}

export const fetchReceiptFile = async ({ id, token }: FetchReceiptFileParams): Promise<FetchReceiptFileResponse> => {
  try {
    const response = await axiosInstance.get(`/receipts/${id}/file`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch PDF file link");
    }
  } catch (error) {
    console.log("Error fetching PDF file:", error);
    throw error;
  }
};