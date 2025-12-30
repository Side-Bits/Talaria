import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, ScrollView, useWindowDimensions, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function TabTravel() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  return (
    <ThemedView type='middle' style={{ backgroundColor: '#fff' }}>
      <View style={{ maxWidth: 500, width:'100%', paddingHorizontal: 16 }}>
        <ThemedView type='left'>
          <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <ThemedView type='list' style={{ marginBottom: 32, marginTop: 32 }}>
              <ThemedView type='between'>
                <ThemedText type="title">Viaje a Venecia</ThemedText>
              </ThemedView>
              <ThemedText type="default" style={{ color: Colors.light.gray }}>Italy</ThemedText>
            </ThemedView>
            <ThemedView type='left' style={{ width:'100%' }}>
              <ThemedView type='between' style={{ marginBottom: 8 }}>
                <ThemedText type="subtitle">Monday</ThemedText>
                <Ionicons name="chevron-down-outline" size={20} color={Colors.light.gray} />
              </ThemedView>
              {Array.from({ length: 2 }).map((_, i) => (
                <ThemedView key={i} type='list' style={ styles.container }>
                  <ThemedText type="default">Lugar</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderBlockColor: Colors.light.border,
    backgroundColor: Colors.light.template,
    marginBottom: 8,
  }
});