import axios from 'axios';
import { demoStore } from './demoStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tasks90_token') || localStorage.getItem('tasks_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful GitHub Pages static fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If request failed because of static GitHub Pages hosting (no backend running)
    const isNetworkOr404 =
      !error.response ||
      error.response.status === 404 ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED';

    if (isNetworkOr404 && error.config) {
      const { url, method, data } = error.config;
      const parsedData = typeof data === 'string' ? JSON.parse(data || '{}') : data || {};

      // Mock Auth endpoints
      if (url.includes('/auth/login')) {
        const users = demoStore.getUsers();
        const user = users.find((u) => u.email === parsedData.email) || users[0];
        const resData = {
          success: true,
          data: { ...user, token: 'mock-static-token-tasks90' },
          message: 'Logged in (Static Demo Mode)',
        };
        return { data: resData, status: 200 };
      }

      if (url.includes('/auth/register')) {
        const newUser = {
          _id: `u-${Date.now()}`,
          name: parsedData.name || 'New Member',
          email: parsedData.email || 'user@tasks90.io',
          role: parsedData.role || 'member',
          title: parsedData.title || 'Product Engineer',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsedData.name || 'user'}`,
          token: 'mock-static-token-tasks90',
        };
        return { data: { success: true, data: newUser, message: 'Registered' }, status: 201 };
      }

      if (url.includes('/auth/me')) {
        const user = JSON.parse(localStorage.getItem('tasks90_user') || localStorage.getItem('tasks_user') || 'null') || demoStore.getUsers()[0];
        return { data: { success: true, data: user }, status: 200 };
      }

      if (url.includes('/auth/users')) {
        return { data: { success: true, data: demoStore.getUsers() }, status: 200 };
      }

      // Mock Analytics Dashboard
      if (url.includes('/analytics/dashboard')) {
        return { data: { success: true, data: demoStore.getDashboardStats() }, status: 200 };
      }

      // Mock Project Detail
      if (url.match(/\/projects\/[a-zA-Z0-9-_]+/)) {
        const id = url.split('/').pop();
        if (method === 'get') {
          const proj = demoStore.getProjectById(id);
          return { data: { success: true, data: proj }, status: 200 };
        }
        if (method === 'delete') {
          demoStore.deleteProject(id);
          return { data: { success: true, data: { id } }, status: 200 };
        }
      }

      // Mock Projects list / create
      if (url.endsWith('/projects')) {
        if (method === 'get') {
          return { data: { success: true, data: demoStore.getProjects() }, status: 200 };
        }
        if (method === 'post') {
          const newProj = demoStore.createProject(parsedData);
          return { data: { success: true, data: newProj }, status: 201 };
        }
      }

      // Mock Tasks
      if (url.includes('/tasks')) {
        if (url.includes('/status') && method === 'patch') {
          const parts = url.split('/');
          const taskId = parts[parts.length - 2];
          const updated = demoStore.updateTaskStatus(taskId, parsedData.status);
          return { data: { success: true, data: updated }, status: 200 };
        }
        if (method === 'get') {
          return { data: { success: true, data: demoStore.getTasks() }, status: 200 };
        }
        if (method === 'post') {
          const newTask = demoStore.createTask(parsedData);
          return { data: { success: true, data: newTask }, status: 201 };
        }
        if (method === 'delete') {
          const taskId = url.split('/').pop();
          demoStore.deleteTask(taskId);
          return { data: { success: true, data: { id: taskId } }, status: 200 };
        }
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tasks90_token');
      localStorage.removeItem('tasks90_user');
      localStorage.removeItem('tasks_token');
      localStorage.removeItem('tasks_user');
      if (!window.location.hash.includes('login') && !window.location.pathname.includes('login')) {
        window.location.href = '#/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
