import React, { useState } from 'react';
import { View, Alert, ScrollView, useWindowDimensions, Pressable, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { api } from '@/services/api';
import { DEFAULT_TRAVEL, Travel } from '@/types/travel';
import { CalendarDatePickerModal } from '@/components/CalendarDatePickerModal';

const formatDateToISO = (date: Date): string => {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized.toISOString();
};

const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const startOfDay = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

export default function TabTravel() {
  const { height } = useWindowDimensions();

  const [travel, setTravel] = useState<Travel>(DEFAULT_TRAVEL);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    setTravel(prev => ({ ...prev, start_date: formatDateToISO(date) }));
    if (startOfDay(endDate) < startOfDay(date)) {
      setEndDate(date);
      setTravel(prev => ({ ...prev, end_date: formatDateToISO(date) }));
    }
    setShowStartPicker(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    setTravel(prev => ({ ...prev, end_date: formatDateToISO(date) }));
    setShowEndPicker(false);
  };

  const handleTravel = async () => {
    // TODO: Change the alerts for inline error messages
    if (!travel.name.trim()) {
      Alert.alert('Missing info', 'Please enter a travel name');
      return;
    }
    if (!travel.start_date || !travel.end_date) {
      Alert.alert('Missing info', 'Please select both start and end dates');
      return;
    }
    if (startOfDay(endDate) < startOfDay(startDate)) {
      Alert.alert('Invalid dates', 'End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      await api.post('api/travels/create', travel);
    } catch {
      Alert.alert('Error', 'Failed to create travel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemedView type='left'>
        <ScrollView
          style={{ width: '100%', maxHeight: height }}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <Header label='New trip' />

          <ThemedView type='left' style={screenStyles.form}>
            {/* Name */}
            <ThemedInput
              type='text'
              label='Travel name'
              value={travel.name}
              onChangeText={text => setTravel(prev => ({ ...prev, name: text }))}
            />

            {/* Date row */}
            <View style={screenStyles.dateRow}>
              <View style={screenStyles.dateField}>
                <ThemedText style={screenStyles.dateLabel}>Start date</ThemedText>
                <Pressable onPress={() => setShowStartPicker(true)}>
                  <ThemedInput
                    type='text'
                    label=''
                    value={travel.start_date ? formatDateForDisplay(startDate) : 'Select date'}
                    editable={false}
                    pointerEvents="none"
                  />
                </Pressable>
              </View>

              <ThemedText style={screenStyles.dateSeparator}>→</ThemedText>

              <View style={screenStyles.dateField}>
                <ThemedText style={screenStyles.dateLabel}>End date</ThemedText>
                <Pressable onPress={() => setShowEndPicker(true)}>
                  <ThemedInput
                    type='text'
                    label=''
                    value={travel.end_date ? formatDateForDisplay(endDate) : 'Select date'}
                    editable={false}
                    pointerEvents="none"
                  />
                </Pressable>
              </View>
            </View>

            <ThemedButton title={loading ? 'Creating…' : 'Create trip'} onPress={handleTravel} />
          </ThemedView>
        </ScrollView>
      </ThemedView>

      {/* <Floating /> */}

      <CalendarDatePickerModal
        visible={showStartPicker}
        value={startDate}
        title="Start date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setShowStartPicker(false)}
      />
      <CalendarDatePickerModal
        visible={showEndPicker}
        value={endDate}
        minDate={startDate}
        title="End date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setShowEndPicker(false)}
      />
    </>
  );
}

const screenStyles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    color: '#666',
  },
  dateSeparator: {
    fontSize: 18,
    color: '#aaa',
    paddingBottom: 12,
  },
});
