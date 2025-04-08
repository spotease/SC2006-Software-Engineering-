import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ParkingLocation = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [savedImage, setSavedImage] = useState(null);
  const [savedDescription, setSavedDescription] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const savedImageUri = await AsyncStorage.getItem('parkingImage');
      const savedDesc = await AsyncStorage.getItem('parkingDescription');
      if (savedImageUri) setSavedImage(savedImageUri);
      if (savedDesc) setSavedDescription(savedDesc);
    } catch (error) {
      console.error('Error loading saved location:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveLocation = async () => {
    try {
      if (!image) {
        Alert.alert('Missing Image', 'Please upload a photo of your parking location');
        return;
      }
      await AsyncStorage.setItem('parkingImage', image);
      await AsyncStorage.setItem('parkingDescription', description);
      setSavedImage(image);
      setSavedDescription(description);
      setImage(null);
      setDescription('');
      Alert.alert('Success', 'Parking location saved successfully!');
      loadSavedLocation();
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save parking location');
    }
  };

  const clearSavedLocation = async () => {
    try {
      await AsyncStorage.removeItem('parkingImage');
      await AsyncStorage.removeItem('parkingDescription');
      setSavedImage(null);
      setSavedDescription('');
      setShowSaved(false);
      Alert.alert('Success', 'Saved parking location cleared!');
    } catch (error) {
      console.error('Error clearing saved location:', error);
      Alert.alert('Error', 'Failed to clear saved parking location');
    }
  };

  const toggleSavedView = () => {
    setShowSaved(!showSaved);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("(tabs)/history")} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Parking Location</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.subHeader}>Saved Parking Location</Text>

        {savedImage ? (
          <>
            <TouchableOpacity style={styles.viewPictureButton} onPress={toggleSavedView}>
              <Text style={styles.viewPictureText}>
                {showSaved ? "Hide Saved Picture" : "View Saved Picture"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearSavedLocation}>
              <Text style={styles.clearButtonText}>Clear Saved Location</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noSavedText}>No saved parking location</Text>
        )}

        {showSaved && savedImage && (
          <View style={styles.savedContainer}>
            <Image source={{ uri: savedImage }} style={styles.image} />
            {savedDescription ? <Text style={styles.savedDescription}>{savedDescription}</Text> : null}
          </View>
        )}

        <View style={styles.separator} />

        <Text style={styles.subHeader}>New location</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <Text style={styles.descriptionLabel}>Add description (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Level 3, Section B, Spot 42"
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
          <Text style={styles.saveButtonText}>Save Location</Text>
        </TouchableOpacity>

        {/* Spacer to avoid getting hidden under notch or home bar */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 300,
  },
  subHeader: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  viewPictureButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewPictureText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  noSavedText: {
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  savedContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  savedDescription: {
    color: '#fff',
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 20,
  },
  uploadButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  descriptionLabel: {
    color: '#fff',
    marginTop: 20,
  },
  textInput: {
    height: 100,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    color: '#fff',
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#FF4500',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ParkingLocation;
