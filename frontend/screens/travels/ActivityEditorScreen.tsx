import { View, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Header } from "@/components/Header";
import { ThemedButton } from "@/components/ThemedButton";
import { Categories } from "@/components/Categories";
import { FormDate } from "@/components/FormDate";
import { FormInput } from "@/components/FormInput";
import { Activity, DEFAULT_ACTIVITY } from "@/types/activity";
import { router, useLocalSearchParams } from "expo-router";
import { createActivity, getTravelActivity } from "@/services/api/activity";
import { useForm } from "react-hook-form";
import { activitySchema } from "@/schemas/activity.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

export function ActivityEditorScreen() {
    const { travel_id, activity_id } = useLocalSearchParams();
    const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
    const activityId = Array.isArray(activity_id)
        ? activity_id[0]
        : activity_id;

    const {
        control,
        handleSubmit,
        reset,
        trigger,
        watch,
        formState: { isSubmitting },
    } = useForm<z.input<typeof activitySchema>>({
        resolver: zodResolver(activitySchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: DEFAULT_ACTIVITY,
    });

    const activityName = watch("name");

    const handleActivity = async (activity: Activity) => {
        if (!travelId) {
            Alert.alert("Error", "Missing travel ID");
            return;
        }

        try {
            await createActivity(travelId, activity);
            router.back();
        } catch {
            Alert.alert("Error", "Invalid credentials");
        }
    };

    useEffect(() => {
        if (!travelId || !activityId) return;

        getTravelActivity(travelId, activityId)
            .then((data) => reset(data))
            .catch((error) => {
                console.error(error);
                Alert.alert("Error", "Failed to fetch activity");
            });
    }, [travelId, activityId, reset]);

    return (
        <ThemedView type="left">
            <Header
                code="003"
                label={activityName}
            />
            <ThemedView type="left" style={{ width: "100%" }}>
                <Categories />
                <FormInput
                    control={control}
                    trigger={trigger}
                    name="name"
                    type="text"
                    label="Activity name"
                    required
                    disabled={isSubmitting}
                />
                <ThemedView type="between" style={{ width: "100%" }}>
                    <View style={{ flex: 1 }}>
                        <FormDate
                            control={control}
                            trigger={trigger}
                            name="start_date"
                            label="Start date"
                            required
                            disabled={isSubmitting}
                        />
                    </View>
                    <ThemedText type="center" style={{ marginHorizontal: 12, marginBottom: 8 }}>a</ThemedText>
                    <View style={{ flex: 1 }}>
                        <FormDate
                            control={control}
                            trigger={trigger}
                            name="end_date"
                            label="End date"
                            required
                            disabled={isSubmitting}
                        />
                    </View>
                </ThemedView>
                <FormInput
                    control={control}
                    trigger={trigger}
                    name="location"
                    type="text"
                    label="Location"
                    required
                    disabled={isSubmitting}
                />
                <FormInput
                    control={control}
                    trigger={trigger}
                    name='description'
                    type='text'
                    label='Description'
                    multiline
                    numberOfLines={4}
                    textAlignVertical='top'
                    controlStyle={{
                        alignItems: 'flex-start',
                        minHeight: 96,
                        paddingVertical: 8,
                    }}
                    inputStyle={{ minHeight: 80, paddingTop: 4 }}
                    disabled={isSubmitting}
                />
                <ThemedButton
                    title="Add"
                    id="buttonAdd"
                    style={{ marginTop: 8 }}
                    onPress={handleSubmit(handleActivity)}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
            </ThemedView>
            <View style={{ height: 115, width: "100%" }} />
        </ThemedView>
    );
}
