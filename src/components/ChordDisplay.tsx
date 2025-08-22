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
  nextChord: Chord | null;
  isPulsing: boolean;
  isAccent: boolean;
}

const { width } = Dimensions.get('window');

export function ChordDisplay({ chord, nextChord, isPulsing, isAccent }: ChordDisplayProps) {
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
      
      {chord && nextChord && (
        <View style={styles.nextChordContainer}>
          <Text style={styles.nextChordLabel}>Next:</Text>
          <Text style={styles.nextChordText}>{nextChord.display}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 3,
    minHeight: 60,
    width: '90%',
    maxWidth: 350,
  },
  chordContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  chordText: {
    fontSize: Math.min(width * 0.2, 72),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  placeholderText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
  nextChordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  nextChordLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 12,
    fontWeight: '600',
  },
  nextChordText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
