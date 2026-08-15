import { Activity } from "@/types/activity";
import { api } from "../api";



export function getTravelActivities(travelId: string): Promise<Activity[]> {
	return api.get<Activity[]>(`api/travels/${travelId}/activities`)
}

export function getTravelActivity(travelId: string, activityId: string): Promise<Activity> {

	return api.get<Activity>(`api/travels/${travelId}/activities/${activityId}`)
}


export function createActivity(travelId: string, activity: Activity) {
	return api.post<void>(`api/travels/${travelId}/activities/create`, activity);
}
