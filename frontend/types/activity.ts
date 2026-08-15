const today = new Date();

export interface Activity {
	id: number;
	id_travel: number;
	name: string;
	description: string;
	location: string;
	start_date: string;
	end_date: string;
	price: number;
}

export const DEFAULT_ACTIVITY = {
	id: 0,
	id_travel: 0,
	name: '',
	description: '',
	location: '',
	start_date: today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0') + '',
	end_date: today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0') + '',
	price: 0,
}
