export interface Activity {
	id_activity: number;
	id_travel: number;
	name: string;
	description: string;
	location: string;
	start_date: string;
	end_date: string;
	price: number;
}

export const DEFAULT_ACTIVITY = {
	id_activity: 0,
	id_travel: 0,
	name: '',
	description: '',
	location: '',
	start_date: '',
	end_date: '',
	price: 0,
}
