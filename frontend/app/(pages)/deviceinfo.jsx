import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXjzuJTIKRocH0w08HYCs5C7DB-MDhViU",
    authDomain: "ewastemanagement-7bf01.firebaseapp.com",
    databaseURL: "https://ewastemanagement-7bf01-default-rtdb.firebaseio.com",
    projectId: "ewastemanagement-7bf01",
    storageBucket:"ewastemanagement-7bf01.firebasestorage.app",
    messagingSenderId: "254131401451",
    appId: "1:254131401451:web:9f9891eef8c0e51d2dc4ae",
    measurementId:"G-S320GS59SR"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); // Renamed to avoid conflict with Express `app`

// Initialize Firestore
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

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

  const handleUploadImage = async (imageUri) => {
    try {
      // Create a reference to the file location in Firebase Storage
      const localUri = imageUri;
      const filename = localUri.split('/').pop();
      const storageRef = ref(storage, `DeviceImages/${filename}`);
      const userId =  await AsyncStorage.getItem('ID');
      
      // Convert the image to a blob
      const response = await fetch(localUri);
      const blob = await response.blob();
      
      // Upload the blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Uploaded image to Firebase Storage!');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at', downloadURL);
      
      // Also upload to your Flask app if needed
      const formData = new FormData();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      
      formData.append('file', {
        uri: localUri,
        name: filename,
        type: type,
      });
      
      // need to add 1 more post requests
      const flaskResponse = await axios.post(
        'https://flaskapp-613599475137.asia-east2.run.app/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(" This is the predicted class" + flaskResponse.body);
      console.log("userID:" + userId);

      try {
        const addDeviceEndpoint = await axios.post(
          'https://cloudrunservice-254131401451.us-central1.run.app/user/addDevice',
          {
            deviceName: flaskResponse.data.predicted_class,
            deviceType: flaskResponse.data.predicted_class,
            createdAt: Timestamp.fromDate(new Date()),
            userId: userId,
          }
        );
        console.log('Device added successfully:', addDeviceEndpoint.data);
      } catch (error) {
        console.error('Error adding device:', error.response ? error.response.data : error.message);
        alert('Error adding device');
      }

      alert('Image uploaded successfully');
      
      // Navigate to the device info page with the response data
      router.replace({
        pathname: '/devices',
        params: {
          deviceType: flaskResponse.data.deviceType,
          carbonEmission: flaskResponse.data.carbonEmission,
          imageUrl: downloadURL  // Pass the Firebase Storage URL
        }
      });
      
    } catch(err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image');
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
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.changeButton} 
                onPress={showImageSourceOptions}
              >
                <Text style={styles.changeButtonText}>Change Image</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={() => handleUploadImage(image)}
              >
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
            </View>
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
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
    },
    changeButton: {
      padding: 8,
      backgroundColor: '#F2F2F2',
      borderRadius: 4,
      flex: 1,
      marginRight: 8,
      alignItems: 'center',
    },
    changeButtonText: {
      color: '#4285F4',
      fontSize: 14,
      fontWeight: '500',
    },
    uploadButton: {
      padding: 8,
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      flex: 1,
      marginLeft: 8,
      alignItems: 'center',
    },
    uploadButtonText: {
      color: 'white',
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