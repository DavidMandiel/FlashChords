import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  TouchableOpacity,
} from 'react-native';

interface BpmSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
}

const SLIDER_WIDTH = 280;
const SLIDER_HEIGHT = 40;
const THUMB_SIZE = 24;

export function BpmSlider({ value, onValueChange, min, max }: BpmSliderProps) {
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH);
  const translateX = useRef(new Animated.Value(0)).current;
  const [currentValue, setCurrentValue] = useState(value);
  const lastUpdateTime = useRef(0);
  const isDragging = useRef(false);
  const sliderRef = useRef<View>(null);
  const sliderLeft = useRef(0);

  const updateValue = (x: number) => {
    const clampedX = Math.max(0, Math.min(x, sliderWidth - THUMB_SIZE));
    const percentage = clampedX / (sliderWidth - THUMB_SIZE);
    const newValue = Math.round(min + percentage * (max - min));
    
    // Throttle updates to reduce sensitivity
    const now = Date.now();
    if (now - lastUpdateTime.current > 100 && newValue !== currentValue) {
      lastUpdateTime.current = now;
      setCurrentValue(newValue);
      onValueChange(newValue);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only start panning if there's significant movement
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: (_, gestureState) => {
        isDragging.current = true;
        
        // Calculate the target position based on touch location relative to slider
        const touchX = gestureState.x0;
        const relativeX = touchX - sliderLeft.current - THUMB_SIZE / 2;
        const clampedX = Math.max(0, Math.min(relativeX, sliderWidth - THUMB_SIZE));
        
        translateX.setValue(clampedX);
        updateValue(clampedX);
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isDragging.current) return;
        
        // Calculate position based on absolute touch position relative to slider
        const touchX = gestureState.moveX;
        const relativeX = touchX - sliderLeft.current - THUMB_SIZE / 2;
        const clampedX = Math.max(0, Math.min(relativeX, sliderWidth - THUMB_SIZE));
        
        translateX.setValue(clampedX);
        updateValue(clampedX);
      },
      onPanResponderRelease: () => {
        isDragging.current = false;
        // Snap to nearest value
        const percentage = translateX._value / (sliderWidth - THUMB_SIZE);
        const snappedValue = Math.round(min + percentage * (max - min));
        const snappedPercentage = (snappedValue - min) / (max - min);
        const snappedX = snappedPercentage * (sliderWidth - THUMB_SIZE);
        
        Animated.spring(translateX, {
          toValue: snappedX,
          useNativeDriver: false,
          tension: 60,
          friction: 12,
        }).start();
        
        updateValue(snappedX);
      },
    })
  ).current;

  // Update thumb position when value changes externally
  React.useEffect(() => {
    if (!isDragging.current) {
      const percentage = (value - min) / (max - min);
      const newX = percentage * (sliderWidth - THUMB_SIZE);
      translateX.setValue(newX);
      setCurrentValue(value);
    }
  }, [value, min, max, sliderWidth, translateX]);

  const progressWidth = translateX.interpolate({
    inputRange: [0, sliderWidth - THUMB_SIZE],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1);
    onValueChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1);
    onValueChange(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderRow}>
        {/* Decrement Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleDecrement}
          disabled={value <= min}
        >
          <Text style={[styles.buttonText, value <= min && styles.buttonTextDisabled]}>
            -
          </Text>
        </TouchableOpacity>

        {/* Slider */}
        <View
          ref={sliderRef}
          style={styles.sliderContainer}
          onLayout={(event) => {
            setSliderWidth(event.nativeEvent.layout.width);
            // Measure the slider's position on screen
            sliderRef.current?.measure((x, y, width, height, pageX, pageY) => {
              sliderLeft.current = pageX;
            });
          }}
        >
          {/* Track */}
          <View style={styles.track}>
            <Animated.View 
              style={[
                styles.progress, 
                { width: progressWidth }
              ]} 
            />
          </View>

          {/* Thumb */}
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX }],
              },
            ]}
            {...panResponder.panHandlers}
          />

          {/* Tick marks */}
          <View style={styles.tickMarks}>
            {(() => {
              const ticks = [];
              const step = Math.max(1, Math.floor((max - min) / 10));
              for (let i = min; i <= max; i += step) {
                ticks.push(i);
              }
              return ticks.map((tick, index) => {
                const percentage = (tick - min) / (max - min);
                const left = percentage * (sliderWidth - THUMB_SIZE);
                return (
                  <View
                    key={`tick-${tick}-${index}`}
                    style={[
                      styles.tick,
                      { left: left },
                      tick % 40 === 0 && styles.majorTick,
                    ]}
                  />
                );
              });
            })()}
          </View>
        </View>

        {/* Increment Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleIncrement}
          disabled={value >= max}
        >
          <Text style={[styles.buttonText, value >= max && styles.buttonTextDisabled]}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Labels */}
      <View style={styles.labels}>
        <Text style={styles.label}>{min}</Text>
        <Text style={styles.label}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    position: 'relative',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: THUMB_SIZE / 2,
    position: 'absolute',
    top: (SLIDER_HEIGHT - THUMB_SIZE) / 2,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    zIndex: 10,
  },
  tickMarks: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  tick: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: (SLIDER_HEIGHT - 8) / 2,
  },
  majorTick: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    top: (SLIDER_HEIGHT - 12) / 2,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
