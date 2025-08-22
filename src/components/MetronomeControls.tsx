import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { TimeSignature } from '../types';
import { getNextChordEveryOptions } from '../utils/chordUtils';
import { BpmSlider } from './BpmSlider';

interface MetronomeControlsProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  timeSignature: TimeSignature;
  onTimeSignatureChange: (timeSignature: TimeSignature) => void;
  nextChordEveryBeats: number;
  onNextChordEveryChange: (beats: number) => void;
  countInEnabled: boolean;
  onCountInToggle: () => void;
  isPlaying: boolean;
  onStartStop: () => void;
  onNext: () => void;
  onReset: () => void;
  isChordPoolValid: boolean;
  isInCountIn: boolean;
  countInBeat: number;
}

interface DropdownProps {
  value: string | number;
  onValueChange: (value: string | number) => void;
  options: Array<{ label: string; value: string | number }>;
  placeholder?: string;
}

function Dropdown({ value, onValueChange, options, placeholder }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownMenu}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  option.value === value && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    option.value === value && styles.dropdownItemTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export function MetronomeControls({
  bpm,
  onBpmChange,
  timeSignature,
  onTimeSignatureChange,
  nextChordEveryBeats,
  onNextChordEveryChange,
  countInEnabled,
  onCountInToggle,
  isPlaying,
  onStartStop,
  onNext,
  onReset,
  isChordPoolValid,
  isInCountIn,
  countInBeat,
}: MetronomeControlsProps) {
  const nextChordOptions = getNextChordEveryOptions(timeSignature);
  
  const timeSignatureOptions = [
    { label: '4/4', value: '4/4' as TimeSignature },
    { label: '3/4', value: '3/4' as TimeSignature },
    { label: '6/8', value: '6/8' as TimeSignature },
  ];

  const nextChordDropdownOptions = nextChordOptions.map(option => ({
    label: `${option} beat${option > 1 ? 's' : ''}`,
    value: option,
  }));

  return (
    <View style={styles.container}>
      {/* BPM Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tempo</Text>
        <BpmSlider
          value={bpm}
          onValueChange={onBpmChange}
          min={20}
          max={240}
        />
        <Text style={styles.bpmText}>{bpm} BPM</Text>
      </View>

      {/* Time Signature & Next Chord Every */}
      <View style={styles.row}>
        <View style={styles.halfSection}>
          <Text style={styles.sectionTitle}>Time Signature</Text>
          <Dropdown
            value={timeSignature}
            onValueChange={onTimeSignatureChange}
            options={timeSignatureOptions}
          />
        </View>

        <View style={styles.halfSection}>
          <Text style={styles.sectionTitle}>Next Chord Every</Text>
          <Dropdown
            value={nextChordEveryBeats}
            onValueChange={onNextChordEveryChange}
            options={nextChordDropdownOptions}
          />
        </View>
      </View>

      {/* Count-in Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Count-in</Text>
        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={onCountInToggle}
        >
          <View style={[styles.toggle, countInEnabled && styles.toggleActive]}>
            <View style={[styles.toggleThumb, countInEnabled && styles.toggleThumbActive]} />
          </View>
          <Text style={styles.toggleLabel}>Count-in (4 beats)</Text>
        </TouchableOpacity>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.primaryButton,
              !isChordPoolValid && styles.disabledButton,
            ]}
            onPress={onStartStop}
            disabled={!isChordPoolValid}
          >
            <Text style={styles.primaryButtonText}>
              {isPlaying ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={onNext}
            disabled={!isChordPoolValid}
          >
            <Text style={styles.secondaryButtonText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={onReset}
          >
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Count-in Display */}
        {isInCountIn && (
          <View style={styles.countInContainer}>
            <Text style={styles.countInText}>
              Count-in: {countInBeat + 1}/4
            </Text>
          </View>
        )}

        {/* Warning */}
        {!isChordPoolValid && (
          <Text style={styles.warningText}>
            Please select at least one chord quality
          </Text>
        )}
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  bpmText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 200,
    maxHeight: 300,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropdownItemTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggle: {
    width: 50,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 2,
    marginRight: 10,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  toggleLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  controlsSection: {
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  countInContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  countInText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  warningText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
