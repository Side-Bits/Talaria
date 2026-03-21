export interface User {
	id: number;
	username: string;
	email: string;
	password: string;
}

export interface LoginCredentials {
	identifier: 0;
	password: string;
}

export interface RegisterCredentials extends LoginCredentials {
	username: string;
}
