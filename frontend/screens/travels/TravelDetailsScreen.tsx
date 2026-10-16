import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Colors';
import { useTravels } from '@/hooks/useTravels';
import { Tabs } from '@/components/Tabs';
import { HeroTravel } from '@/screens/travels/components/HeroTravel';
import { TravelCard } from './components/TravelCard';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function TravelDetailsScreen() {
  const { state, retry } = useTravels();
  const [activeTab, setActiveTab] = useState('planned');

  function renderTrips() {
    if (state.status === 'loading') {
      // TODO skeleton
      return (
        <View style={styles.feedback}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      );
    }

    if (state.status === 'error') {
      return (
        <View style={styles.errorCard}>
          <View style={styles.errorIcon} accessible={false}>
            <Ionicons name="alert-circle-outline" size={32} color={Colors.light.error} />
          </View>
          <ThemedText style={styles.errorTitle} accessibilityRole="alert">
            We couldn&apos;t load your trips
          </ThemedText>
          <View style={styles.errorDetails}>
            <ThemedText style={styles.errorMessage} selectable>
              {state.error.message}
            </ThemedText>
          </View>
          <ThemedButton
            title="Try again"
            onPress={retry}
            variant='outline'
            leadingIcon={props => <Ionicons name="refresh-outline" {...props} />}
            buttonStyle={styles.retryButton}
            textStyle={styles.retryText}
          />
        </View>
      );
    }

    if (activeTab === 'undated') {
      return (
        <View style={styles.feedback}>
          <ThemedText muted>Undated trips aren’t available yet.</ThemedText>
        </View>
      );
    }

    const trips = activeTab === 'planned' ? state.data.Going : state.data.Done;

    if (trips.length === 0) {
      return (
        <View style={styles.feedback}>
          <ThemedText muted>
            {activeTab === 'planned' ? 'No planned trips yet.' : 'No completed trips yet.'}
          </ThemedText>
          <ThemedText
            style={styles.createLink}
            onPress={() => router.push('/travels/create')}
          >
            Create one!
          </ThemedText>
        </View>
      );
    }

    return trips.map(travel => <TravelCard key={travel.id} travel={travel} />);
  }

  return (
    <ThemedView type='left'>
      <Header
        button_back={false}
        button_menu={true}
        label="My Trips"
      />
      <HeroTravel />
      <Tabs
        data={{
          planned: { label: "Planned" },
          undated: { label: "Undated" },
          completed: { label: "Completed" }
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        scroll={false}
      />
      <ThemedView type='left' style={styles.trips}>
        {renderTrips()}
        <View style={styles.bottomSpacer} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  trips: {
    width: '100%',
  },
  createLink: {
    color: Colors.light.primary,
    textDecorationLine: 'underline',
  },
  bottomSpacer: {
    height: 115,
    width: '100%',
  },
  feedback: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  errorCard: {
    width: '100%',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    gap: 12,
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.onSurface,
    textAlign: 'center',
  },
  errorDetails: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.light.border,
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.light.onSurface,
    textAlign: 'center',
  },
  retryButton: {
    width: 'auto',
    minWidth: 144,
    marginTop: 4,
  },
  retryText: {
    fontWeight: '600',
  },
});
