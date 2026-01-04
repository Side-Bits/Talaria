import { use, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import { User, LoginCredentials } from '@/types/user';
import { api } from '@/services/api';

interface AuthContextType {
	signIn: (credentials: LoginCredentials) => Promise<void>;
	signOut: () => Promise<void>;
	session?: string | null;
	user?: User | null;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	signIn: async () => { },
	signOut: async () => { },
	session: null,
	user: null,
	isLoading: false,
});

export function useSession() {
	const value = use(AuthContext);
	if (!value) {
		throw new Error('useSession must be wrapped in a <SessionProvider />');
	}
	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState('session');
	const [[, userData], setUserData] = useStorageState('user');

	const signIn = async (credentials: LoginCredentials): Promise<void> => {
		try {
			const response = await api.post<{ token: string; user: User }>(
				'login',
				{ email: credentials.email, password: credentials.password },
				{ requiresAuth: false }  // No auth header added
			);
			console.log(response);

			// Store session token and user data
			setSession(response.token);
			setUserData(JSON.stringify(response.user));
		} catch (error) {
			// Clear any existing session on error
			setSession(null);
			setUserData(null);
			throw error;
		}
	};

	const signOut = async (): Promise<void> => {
		try {
			setSession(null);
			setUserData(null);
		} catch (error) {
			console.error('Sign out error:', error);
			// Clear local data even if API call fails
			setSession(null);
			setUserData(null);
		}
	};

	return (
		<AuthContext
			value={{
				signIn,
				signOut,
				session,
				user: userData ? JSON.parse(userData) : null,
				isLoading,
			}}>
			{children}
		</AuthContext>
	);
}
