import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const parkingLocation = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const saveLocation = () => {
    // Save the location logic here
    console.log('Location saved:', { description, image });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Parking Location</Text>
      <Text style={styles.subHeader}>Saved Parking Location</Text>
      <TouchableOpacity style={styles.viewPictureButton}>
        <Text style={styles.viewPictureText}>View Saved Picture</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <Text style={styles.subHeader}>New location</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text style={styles.descriptionLabel}>Add description (Optional)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="text.."
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Save" onPress={saveLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subHeader: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  viewPictureButton: {
    marginTop: 10,
  },
  viewPictureText: {
    color: '#1E90FF',
  },
  separator: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  uploadButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#000',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  descriptionLabel: {
    color: '#fff',
    marginTop: 20,
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    color: '#fff',
  },
});

export default parkingLocation;