import React, { useState } from 'react';
import { ActivityIndicator, ImageBackground, Pressable, StyleSheet, View } from 'react-native';

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
  const nextTravel = state.status === 'success' ? state.data.Going[0] : undefined;

  function renderTrips() {
    if (state.status === 'loading') {
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
        label="My Trips"
      />
      {state.status !== 'success' || state.data.Going.length > 0 || state.data.Done.length > 0 ? (
        <>
          {nextTravel && <HeroTravel travel={nextTravel} />}
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
      ) : (
        <>
          <View style={styles.imageGallery}>
            <ImageBackground
              source={require('../../assets/images/temporal/tailandia.jpg')}
              style={styles.image2}
              resizeMode="cover"
            />
            <ImageBackground
              source={require('../../assets/images/temporal/pedraforca.jpg')}
              style={styles.image3}
              resizeMode="cover"
            />
            <ImageBackground
              source={require('../../assets/images/temporal/roma.jpg')}
              style={styles.image1}
              resizeMode="cover"
            />
          </View>
          <ThemedView type='center' style={styles.feedback}>
            <ThemedText type="subtitle">
              Every journey tells a story
            </ThemedText>
            <ThemedText textMuted={true}>
              Your next adventure starts with a plan
            </ThemedText>
            <ThemedText
              type='link'
              onPress={() => router.push('/travels/create')}
            >
              Create an travel
            </ThemedText>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  imageGallery: {
    marginVertical: 32,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center', // centra en vertical
    alignItems: 'center', 
    gap: 8,
  },
  image1: {
    backgroundColor: Colors.light.iconBackground,
    height: 130,
    width: 130,
    top: 0,
    alignSelf: 'center',
    zIndex: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  image2: {
    backgroundColor: Colors.light.iconBackground,
    position: 'absolute',
    top: 2,
    left: '20%',
    width: 130,
    height: 130,
    zIndex: 1,
    elevation: 1,
    overflow: 'hidden',
    transform: [{ rotate: '-6deg' }],
  },
  image3: {
    backgroundColor: Colors.light.iconBackground,
    position: 'absolute',
    top: 10,
    right: '20%',
    height: 130,
    width: 130,
    zIndex: 1,
    elevation: 1,
    overflow: 'hidden',
    transform: [{ rotate: '8deg' }],
  },
  trips: {
    width: '100%',
  },
  bottomSpacer: {
    height: 115,
    width: '100%',
  },
  feedback: {
    width: '100%',
    paddingVertical: 16,
    gap: 4,
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
  create: {
    width: '100%',
    minHeight: 45,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#fcfcfc',
    borderStyle: 'dashed',
  },
  textCenter: {
    width: '100%',
    marginBottom: 16,
    textAlign: 'center'
  }
});
