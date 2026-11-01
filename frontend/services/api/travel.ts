import { Travel } from "@/types/travel"
import { api } from "../api"

const ENDPOINTS = {
	getTravels: 'api/travels',
}

export function getTravels() {
	return api.get<{ G?: Travel[]; D?: Travel[] }>(ENDPOINTS.getTravels)
}

export function getTravel(travelId: string) {
    return api.get<Travel>(`${ENDPOINTS.getTravels}/${travelId}`)
}

export function createTravel(travel: Travel) {
	return api.post('api/travels/create', travel);
}

export function deleteTravel(travelId: string) {
	return api.post(`api/travels/delete/${travelId}`);
}