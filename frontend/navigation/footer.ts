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
): { activeTab: FooterTab | null; destinations: FooterDestination[] } {
    // Ignorar grupos como (app)
    const route = segments
        .filter((segment) => !segment.startsWith("("))
        .join("/");
    const travelId = firstParam(params.travel_id);
    // Admitimos ambos nombres de parámetro y usamos Trip si no hay un nombre disponible.
    const travelName = firstParam(params.travel_name) || firstParam(params.name) || "Trip";
    const isTripRoute = /^travels\/\[travel_id\](?:\/|$)/.test(route);
    const isInsideTrip = Boolean(isTripRoute && travelId);
    const isHome = route === "travels";
    const isProfile = route === "id-profile";
    const isTripOverview = isInsideTrip && route === "travels/[travel_id]/activities";
    const isCreateTrip = route === "travels/create";
    const isCreateActivity = isInsideTrip && route === "travels/[travel_id]/activities/create";
    const isCreate = isCreateTrip || isCreateActivity;

    const activeTab: FooterTab | null = isCreate
        ? "create"
        : isInsideTrip
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
    ];

    // El botón Trip solo aparece dentro de un viaje
    if (isInsideTrip && travelId) {
        destinations.push({
            id: "trip",
            label: "Trip",
            href: {
                pathname: "/(app)/travels/[travel_id]/activities",
                params: { travel_id: travelId, name: travelName },
            },
            method: "replace",
            isCurrentScreen: isTripOverview,
        });
    }

    // El botón + crea una actividad dentro de un viaje y un viaje en las demás pantallas.
    destinations.push(
        {
            id: "create",
            label: isInsideTrip ? "Create activity" : "Create trip",
            href:
                isInsideTrip && travelId
                    ? {
                        pathname: "/(app)/travels/[travel_id]/activities/create",
                        params: { travel_id: travelId },
                    }
                    : { pathname: "/(app)/travels/create" },
            method: "push",
            isCurrentScreen: isCreate,
        },
        {
            id: "profile",
            label: "Profile",
            href: { pathname: "/(app)/id-profile" },
            method: "replace",
            isCurrentScreen: isProfile,
        },
    );

    return { activeTab, destinations };
}
