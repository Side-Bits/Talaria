import { Profile } from "@/types/profile";
import { api } from "../api";

export function getProfile() {
    return api.get<Profile>(`api/profile`);
}

export function updateProfile(profile: Profile) {
    return api.post<Profile>(`api/profile/edit`, profile);
}