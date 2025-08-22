import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Chord } from '../types';

interface ChordDisplayProps {
  chord: Chord | null;
  isPulsing: boolean;
  isAccent: boolean;
}

const { width } = Dimensions.get('window');

export function ChordDisplay({ chord, isPulsing, isAccent }: ChordDisplayProps) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPulsing) {
      const pulseValue = isAccent ? 1.2 : 1.1;
      const duration = isAccent ? 200 : 150;
      
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: pulseValue,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isPulsing, isAccent, pulseAnim]);

  useEffect(() => {
    if (chord) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [chord, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.chordContainer,
          {
            transform: [
              { scale: Animated.multiply(pulseAnim, scaleAnim) },
            ],
          },
        ]}
      >
        <Text style={styles.chordText}>
          {chord?.display || '--'}
        </Text>
      </Animated.View>
      
      {!chord && (
        <Text style={styles.placeholderText}>
          Select chord qualities to start
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 200,
  },
  chordContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  chordText: {
    fontSize: Math.min(width * 0.15, 72),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  placeholderText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
});
