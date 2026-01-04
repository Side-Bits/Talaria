export interface User {
	id: string;
	username: string;
	email: string;
	password: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}
