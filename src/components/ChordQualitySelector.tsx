import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ChordQuality, ChordProgressionMode } from '../types';

interface ChordQualitySelectorProps {
  enabledQualities: ChordQuality[];
  onToggleQuality: (quality: ChordQuality) => void;
  progressionMode: ChordProgressionMode;
  onSetProgressionMode: (mode: ChordProgressionMode) => void;
}

const CHORD_QUALITIES: { quality: ChordQuality; label: string; symbol: string }[] = [
  { quality: 'major', label: 'Major', symbol: '' },
  { quality: 'minor', label: 'Minor', symbol: 'm' },
  { quality: '7th', label: '7th', symbol: '7' },
  { quality: '5th', label: '5th', symbol: '5' },
  { quality: 'diminished', label: 'Diminished', symbol: 'dim' },
];

export function ChordQualitySelector({
  enabledQualities,
  onToggleQuality,
  progressionMode,
  onSetProgressionMode,
}: ChordQualitySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chord Qualities</Text>
      
      <View style={styles.qualitiesContainer}>
        {CHORD_QUALITIES.map(({ quality, label, symbol }) => {
          const isEnabled = enabledQualities.includes(quality);
          return (
            <TouchableOpacity
              key={quality}
              style={[
                styles.qualityButton,
                isEnabled && styles.qualityButtonActive,
              ]}
              onPress={() => onToggleQuality(quality)}
            >
              <Text style={[
                styles.qualityLabel,
                isEnabled && styles.qualityLabelActive,
              ]}>
                {label}
              </Text>
              <Text style={[
                styles.qualitySymbol,
                isEnabled && styles.qualitySymbolActive,
              ]}>
                {symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.flatsToggleContainer}>
        <Text style={styles.flatsLabel}>Chord Progression:</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              progressionMode === 'random' && styles.toggleButtonActive,
            ]}
            onPress={() => onSetProgressionMode('random')}
          >
            <Text style={[
              styles.toggleText,
              progressionMode === 'random' && styles.toggleTextActive,
            ]}>
              Random
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              progressionMode === 'circle_of_fifths' && styles.toggleButtonActive,
            ]}
            onPress={() => onSetProgressionMode('circle_of_fifths')}
          >
            <Text style={[
              styles.toggleText,
              progressionMode === 'circle_of_fifths' && styles.toggleTextActive,
            ]}>
              Circle 5th
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              progressionMode === 'circle_of_fourths' && styles.toggleButtonActive,
            ]}
            onPress={() => onSetProgressionMode('circle_of_fourths')}
          >
            <Text style={[
              styles.toggleText,
              progressionMode === 'circle_of_fourths' && styles.toggleTextActive,
            ]}>
              Circle 4th
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {enabledQualities.length === 0 && (
        <Text style={styles.warningText}>
          Select at least one chord quality to start practicing
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    margin: 1,
    marginTop: 0,
    width: '90%',
    maxWidth: 350,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  qualitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 5,
  },
  qualityButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 3,
    minWidth: 45,
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  qualityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  qualityLabelActive: {
    color: '#FFFFFF',
  },
  qualitySymbol: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 1,
  },
  qualitySymbolActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  flatsToggleContainer: {
    alignItems: 'center',
  },
  flatsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  warningText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
});
