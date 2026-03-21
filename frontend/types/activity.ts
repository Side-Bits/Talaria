export interface Activity {
	id_activity: string;
	id_travel: string;
	name: string;
	description: string;
	location: string;
	start_date: string;
	end_date: string;
	price: number;
}

export const DEFAULT_ACTIVITY = {
	id_activity: '',
	id_travel: '',
	name: '',
	description: '',
	location: '',
	start_date: '',
	end_date: '',
	price: 0,
}
