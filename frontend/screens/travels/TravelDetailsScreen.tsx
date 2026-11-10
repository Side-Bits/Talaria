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
import { ImageGallery } from './components/ImageGallery';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function TravelDetailsScreen() {
  const { state, retry } = useTravels();
  const [activeTab, setActiveTab] = useState('planned');
  const nextTravel = state.status === 'success' ? state.data.Going[0] : undefined;

  function renderTrips() {
    if (state.status !== 'success') return null;

    if (activeTab === 'undated') {
      return (
        <ThemedView type='center' style={styles.feedback}>
          <ThemedText textMuted={true}>Undated trips aren’t available yet</ThemedText>
        </ThemedView>
      );
    }

    const trips = activeTab === 'planned' ? state.data.Going.slice(1) : state.data.Done;

    if (trips.length === 0) {
      return (
        <ThemedView type='center' style={styles.feedback}>
          <ThemedText textMuted={true}>
            {activeTab === 'planned' ?
            (state.data.Going[0] ? 'Your next trip is waiting' : 'No planned trips yet') :
            'No completed trips yet'}
          </ThemedText>
          <ThemedText
            type='link'
            onPress={() => router.push('/travels/create')}
          >
            Create an travel
          </ThemedText>
        </ThemedView>
      );
    }

    return trips.map(travel => <TravelCard key={travel.id} travel={travel} />);
  }

  return (
    <ThemedView type='left'>
      <Header
        button_back={false}
        button_notifications={true}
        label="My Trips"
      />
      {state.status === 'loading' ? (
        <View style={styles.feedback}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      ) : state.status === 'error' ? (
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
      ) : state.data.Going.length === 0 && state.data.Done.length === 0 ? (
        <>
          <ImageGallery />
          <ThemedView type='center' style={styles.feedback}>
            <ThemedText type="subtitle">
              Every journey tells a story
            </ThemedText>
            <ThemedText textMuted={true}>
              Your next adventure starts with a plan
            </ThemedText>
            <ThemedButton
              title="Create an travel"
              width="auto"
              size='sm'
              buttonStyle={{ backgroundColor: Colors.light.primary }}
              textStyle={{ color: Colors.light.onPrimary }}
              onPress={() => router.push('/travels/create')}
            />
          </ThemedView>
          <View style={styles.bottomSpacer} />
        </>
      ) : (
        <>
          {nextTravel ? (
            <HeroTravel travel={nextTravel} />
          ) : (
            <View style={styles.emptyHero}></View>
          )}
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
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  trips: {
    width: '100%',
  },
  emptyHero: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.onBackground,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  bottomSpacer: {
    height: 90,
    width: '100%',
  },
  feedback: {
    width: '100%',
    paddingVertical: 16,
    gap: 8,
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
