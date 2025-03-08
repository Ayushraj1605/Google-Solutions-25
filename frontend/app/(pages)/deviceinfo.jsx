import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const Deviceinfo = () => {
  const [image, setImage] = useState(null);

  const showImageSourceOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: takePhoto,
        },
        {
          text: 'Gallery',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      // Launch camera
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Camera result:', result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Error taking photo');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need gallery permissions to make this work!');
        return;
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Gallery picker result:', result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      alert('Error selecting image');
    }
  };

  return (
    <SafeAreaView className="w-full h-full items-center justify-center bg-white">
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={showImageSourceOptions}>
          <Text style={styles.buttonText}>Add Image</Text>
        </TouchableOpacity>
        
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity 
              style={styles.changeButton} 
              onPress={showImageSourceOptions}
            >
              <Text style={styles.changeButtonText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  changeButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 4,
  },
  changeButtonText: {
    color: '#4285F4',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholder: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  placeholderText: {
    color: '#757575',
    fontSize: 16,
  },
});

export default Deviceinfo;