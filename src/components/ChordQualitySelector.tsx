import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ChordQuality } from '../types';

interface ChordQualitySelectorProps {
  enabledQualities: ChordQuality[];
  onToggleQuality: (quality: ChordQuality) => void;
  useFlats: boolean;
  onToggleFlats: () => void;
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
  useFlats,
  onToggleFlats,
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
        <Text style={styles.flatsLabel}>Note Names:</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !useFlats && styles.toggleButtonActive,
            ]}
            onPress={() => !useFlats || onToggleFlats()}
          >
            <Text style={[
              styles.toggleText,
              !useFlats && styles.toggleTextActive,
            ]}>
              Sharps ♯
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              useFlats && styles.toggleButtonActive,
            ]}
            onPress={() => useFlats || onToggleFlats()}
          >
            <Text style={[
              styles.toggleText,
              useFlats && styles.toggleTextActive,
            ]}>
              Flats ♭
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
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  qualitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  qualityButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  qualityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  qualityLabelActive: {
    color: '#FFFFFF',
  },
  qualitySymbol: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
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
