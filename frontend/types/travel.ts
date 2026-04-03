const today = new Date();

export interface Travel {
	id: number;
	name: string;
	start_date: string;
	end_date: string;
}

export const DEFAULT_TRAVEL = {
	id: 0,
	name: '',
	start_date: today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0') + '',
	end_date: today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0') + '',
}
