import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, Pressable, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; // Import the slider
import { Ionicons } from '@expo/vector-icons';

const FilterButton = ({ filterOptions = [], onFilterSelect }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [distance, setDistance] = useState(1000); // Default: 1000 metres

  const toggleFilterModal = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleFilterToggle = (filterValue) => {
    if (selectedFilters.includes(filterValue)) {
      setSelectedFilters(selectedFilters.filter((value) => value !== filterValue));
    } else {
      setSelectedFilters([...selectedFilters, filterValue]);
    }
  };

  const applyFilters = () => {
    onFilterSelect({ selectedFilters, distance }); // Pass selected filters and distance
    toggleFilterModal();
  };

  return (
    <>
      <TouchableOpacity onPress={toggleFilterModal}>
        <Ionicons name="filter" size={24} color="#00C3FF" />
      </TouchableOpacity>

      <Modal
        visible={isFilterVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>

            {filterOptions.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.filterOption,
                  selectedFilters.includes(option.value) && styles.filterOptionSelected,
                ]}
                onPress={() => handleFilterToggle(option.value)}
              >
                <Text style={styles.filterOptionText}>{option.label}</Text>
              </Pressable>
            ))}

            <Text style={[styles.sliderText, { color: "#00C3FF" }]}>
              Selected Distance: {distance.toFixed(0)} m
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5000}
              step={100}
              value={distance}
              onValueChange={setDistance}
              minimumTrackTintColor="#00C3FF"
              maximumTrackTintColor="#CCCCCC"
              thumbTintColor="#00C3FF"
            />

            <Pressable style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>

            <Pressable style={styles.closeButton} onPress={toggleFilterModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  filterOptionSelected: {
    backgroundColor: '#00C3FF20',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  sliderLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  applyButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#00C3FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#444444',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default FilterButton;
