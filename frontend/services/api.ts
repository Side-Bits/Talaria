import { getStorageItemAsync } from '@/hooks/useStorageState';

/**
 * Opciones adicionales para personalizar una peticion HTTP.
 * `requiresAuth` controla si se debe adjuntar el token de sesion.
 */
interface ApiOptions extends RequestInit {
	requiresAuth?: boolean;
}

/**
 * Error estandarizado para respuestas HTTP no exitosas.
 * Incluye el codigo de estado y el mensaje devuelto por la API.
 */
class ApiError extends Error {
	constructor(public status: number, message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

/**
 * Ejecuta una peticion HTTP contra la API del backend.
 *
 * Flujo principal:
 * 1) Obtiene el token de sesion desde almacenamiento.
 * 2) Construye headers base y agrega Authorization si aplica.
 * 3) Ejecuta fetch y lanza `ApiError` si la respuesta falla.
 * 4) Devuelve el JSON tipado como `T`.
 */
export async function apiRequest<T>(
	endpoint: string,
	options: ApiOptions = {}
): Promise<T> {
	const { requiresAuth = true, headers = {}, ...rest } = options;
	const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

	// Obtener token de sesion desde almacenamiento
	const session = await getStorageItemAsync('session');

	// Construir headers base
	const requestHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...(headers as Record<string, string>),
	};

	// Agregar Authorization si hay sesion y la peticion requiere autenticacion
	if (requiresAuth && session) {
		requestHeaders['Authorization'] = `Bearer ${session}`;
	}

	// Ejecutar la peticion
	console.log(`API Request: ${endpoint}`, { ...rest, headers: requestHeaders });
	const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
		...rest,
		headers: requestHeaders,
	});

	// Manejar errores HTTP
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new ApiError(
			response.status,
			errorData.message || `Request failed with status ${response.status}`
		);
	}

	// Parsear y devolver la respuesta
	return response.json();
}

/**
 * Metodos de conveniencia para verbos HTTP comunes.
 *
 * Todos delegan en `apiRequest` para mantener una sola logica
 * de autenticacion, manejo de errores y parseo de respuesta.
 */
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
