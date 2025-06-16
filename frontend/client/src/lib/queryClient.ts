import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios from "axios";

// Firebase backend base URL
const API_BASE_URL = "http://localhost:3001/api";

// Configure axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Convert to use axios for Firebase backend
  const fullUrl = url.startsWith('/api') ? `${API_BASE_URL}${url.slice(4)}` : url;
  
  try {
    const response = await apiClient.request({
      method,
      url: fullUrl,
      data,
    });
    
    // Convert axios response to fetch-like response for compatibility
    return {
      ok: true,
      status: response.status,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
    } as Response;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`${error.response.status}: ${error.response.data}`);
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const endpoint = queryKey[0] as string;
    
    try {
      // Convert endpoint to Firebase backend format
      let firebaseEndpoint = endpoint;
      if (endpoint.startsWith('/api/')) {
        firebaseEndpoint = endpoint.slice(4); // Remove '/api/' prefix
      }
      
      const response = await apiClient.get(firebaseEndpoint);
      return response.data;
    } catch (error: any) {
      if (unauthorizedBehavior === "returnNull" && error.response?.status === 401) {
        return null;
      }
      
      if (error.response) {
        throw new Error(`${error.response.status}: ${error.response.data}`);
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
