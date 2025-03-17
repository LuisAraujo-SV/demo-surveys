import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 401 and 403 errors: remove token from storage and redirect to login page
api.interceptors.response.use(
  (response) => response,
  (error) => { 
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      Cookies.remove('token'); // Remove token from cookies
      window.location.href = '/auth/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  category: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  category: string;
  points: number;
  role: 'user' | 'admin';
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  category: string;
  points: number;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'single_choice' | 'multiple_choice';
  options?: string[];
  required: boolean;
}

export interface SurveyResponse {
  surveyId: number;
  answers: Array<{
    question_id: number;
    answer: string | string[];
  }>;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', credentials);
    return response.data;
  },
  register: async (data: RegisterData) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },
};

export const surveyApi = {
  getAll: async (category?: string) => {
    const params = category && category !== '' ? { category } : undefined;
    const response = await api.get<Survey[]>('/surveys', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Survey>(`/surveys/${id}`);
    return response.data;
  },
  submit: async (data: SurveyResponse) => {
    const response = await api.post<{ points: number }>(`/surveys/${data.surveyId}/respond`, data);
    return response.data;
  },
};

export const userApi = {
  getHistory: async () => {
    const response = await api.get<Array<{
      id: number; survey: Survey; points_earned: number; created_at: string 
    }>>('/users/surveys/history');
    return response.data;
  },
};

export default api;