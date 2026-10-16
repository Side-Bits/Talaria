import { use, useCallback, useEffect, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import { User, LoginCredentials, RegisterCredentials } from '@/types/user';
import { api, onUnauthorized } from '@/services/api';

interface AuthContextType {
	signIn: (credentials: LoginCredentials) => Promise<void>;
	signUp: (credentials: RegisterCredentials) => Promise<void>;
	signOut: () => Promise<void>;
	session?: string | null;
	user?: User | null;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	signIn: async () => { },
	signUp: async () => { },
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
	const [[isLoadingSession, session], setSession] = useStorageState('session');
	const [[isLoadingUser, userData], setUserData] = useStorageState('user');
	const isLoading = isLoadingSession || isLoadingUser;

	const signOut = useCallback(async (): Promise<void> => {
		setSession(null);
		setUserData(null);
	}, [setSession, setUserData]);

	useEffect(() => onUnauthorized(signOut), [signOut]);

	const signIn = async (credentials: LoginCredentials): Promise<void> => {
		try {
			const response = await api.post<{ token: string; user: User }>(
				'login',
				{ identifier: credentials.identifier, password: credentials.password },
				{ requiresAuth: false }  // No auth header added
			);
			console.log(response);

			// Store session token and user data
			setSession(response.token);
			setUserData(JSON.stringify(response.user));
		} catch (error) {
			// Clear any existing session on error
			await signOut();
			throw error;
		}
	};


	const signUp = async (credentials: RegisterCredentials): Promise<void> => {
		try {
			const response = await api.post<{ token: string; user: User }>(
				'register',
				{ username: credentials.username, identifier: credentials.identifier, password: credentials.password },
				{ requiresAuth: false }  // No auth header added
			);
			console.log(response);

			// Store session token and user data
			setSession(response.token);
			setUserData(JSON.stringify(response.user));
		} catch (error) {
			// Clear any existing session on error
			await signOut();
			throw error;
		}
	};

	return (
		<AuthContext
			value={{
				signIn,
				signUp,
				signOut,
				session,
				user: userData ? JSON.parse(userData) : null,
				isLoading,
			}}>
			{children}
		</AuthContext>
	);
}
