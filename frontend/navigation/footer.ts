import type { Href } from "expo-router";

export type FooterTab = "home" | "trip" | "create" | "profile";

type SearchParam = string | string[] | undefined;

export type FooterParams = {
    travel_id?: SearchParam;
    travel_name?: SearchParam;
    name?: SearchParam;
};

export type FooterDestination = {
    id: FooterTab;
    label: string;
    href: Href;
    // replace cambia de sección; push permite volver.
    method: "push" | "replace";
    // Permite evitar la navegación cuando el destino ya está abierto.
    isCurrentScreen: boolean;
};

function firstParam(value: SearchParam): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

// Calcula la pestaña activa y los destinos
export function resolveFooterNavigation(
    segments: readonly string[],
    params: FooterParams,
) : { activeTab: FooterTab | null; destinations: FooterDestination[] } {
    // Ignorar grupos como (app)
    const route = segments
        .filter((segment) => !segment.startsWith("("))
        .join("/");
    const travelId = firstParam(params.travel_id);

    const isInsideTrip = Boolean(travelId);
    const isHome = route === "travels";
    const isProfile = route === "id-profile";
    const isCreateTrip = route === "travels/create";
    const isCreateActivity = isInsideTrip && route === "travels/[travel_id]/activities/create";

    const activeTab: FooterTab | null = 
        isCreateTrip || isCreateActivity
        ? "create"
        : travelId
            ? "trip"
            : isProfile
                ? "profile"
                : isHome
                    ? "home"
                    : null;

    const destinations: FooterDestination[] = [
        {
            id: "home",
            label: "Home",
            href: { pathname: "/(app)/travels" },
            method: "replace",
            isCurrentScreen: isHome,
        },
        {
            id: "create",
            label: isInsideTrip ? "Create activity" : "Create trip",
            href:
                isInsideTrip && travelId
                    ? {
                        pathname: "/(app)/travels/[travel_id]/activities/create",
                        params: { travel_id: travelId },
                    }
                    : {
                        pathname: "/(app)/travels/create"
                    },
            method: "push",
            isCurrentScreen: isInsideTrip && travelId ? isCreateTrip : isCreateActivity,
        },
        {
            id: "profile",
            label: "Profile",
            href: { pathname: "/(app)/id-profile" },
            method: "replace",
            isCurrentScreen: isProfile,
        },
    ];

    return { activeTab, destinations };
}
