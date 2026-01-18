export interface User {
	id: string;
	username: string;
	email: string;
	password: string;
}

export interface LoginCredentials {
	identifier: string;
	password: string;
}

export interface RegisterCredentials extends LoginCredentials {
	username: string;
}
