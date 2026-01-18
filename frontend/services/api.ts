import { getStorageItemAsync } from '@/hooks/useStorageState';

interface ApiOptions extends RequestInit {
	requiresAuth?: boolean;
}

class ApiError extends Error {
	constructor(public status: number, message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

export async function apiRequest<T>(
	endpoint: string,
	options: ApiOptions = {}
): Promise<T> {
	const { requiresAuth = true, headers = {}, ...rest } = options;
	const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

	// Get session token from storage
	const session = await getStorageItemAsync('session');

	// Build headers
	const requestHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...(headers as Record<string, string>),
	};

	// Add Authorization header if user is logged in and auth is required
	if (requiresAuth && session) {
		requestHeaders['Authorization'] = `Bearer ${session}`;
	}

	// Make the request
	console.log(`API Request: ${endpoint}`, { ...rest, headers: requestHeaders });
	const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
		...rest,
		headers: requestHeaders,
	});

	// Handle errors
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new ApiError(
			response.status,
			errorData.message || `Request failed with status ${response.status}`
		);
	}

	// Parse and return response
	return response.json();
}

// Convenience methods
export const api = {
	get: <T>(endpoint: string, options?: ApiOptions) =>
		apiRequest<T>(endpoint, { ...options, method: 'GET' }),

	post: <T>(endpoint: string, body?: any, options?: ApiOptions) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'POST',
			body: JSON.stringify(body),
		}),

	put: <T>(endpoint: string, body?: any, options?: ApiOptions) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'PUT',
			body: JSON.stringify(body),
		}),

	delete: <T>(endpoint: string, options?: ApiOptions) =>
		apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

	patch: <T>(endpoint: string, body?: any, options?: ApiOptions) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'PATCH',
			body: JSON.stringify(body),
		}),
};
