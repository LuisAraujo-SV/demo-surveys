import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  getAll: async () => {
    const response = await api.get<Survey[]>('/surveys');
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
      id: any; survey: Survey; points_earned: number; created_at: string 
}>>('/users/surveys/history');
    return response.data;
  },
};

export default api; 