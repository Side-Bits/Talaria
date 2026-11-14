import { Profile, ProfileData } from "@/types/profile";
import { api } from "../api";

export function getProfile() {
    return api.get<ProfileData>(`api/profile`);
}

export function updateProfile(profile: Profile) {
    return api.post<Profile>(`api/profile/edit`, profile);
}