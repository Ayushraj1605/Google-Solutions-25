import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const Deviceinfo = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

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
      setError(null);
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Camera permission is required to take photos');
        return;
      }

      // Launch camera
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setError('Failed to capture image. Please try again.');
    }
  };

  const handleUploadImage = async (imageUri) => {
    if (!imageUri) {
      setError('Please select an image first');
      return;
    }
  
    setUploading(true);
    setError(null);
  
    try {
      // Get the userId from AsyncStorage
      const userId = await AsyncStorage.getItem('ID');
      if (!userId) {
        setError('User not found. Please log in again.');
        setUploading(false);
        return;
      }
  
      // Create a reference to the file location in Firebase Storage
      const localUri = imageUri;
      const filename = localUri.split('/').pop();
      const storageRef = ref(storage, `DeviceImages/${userId}/${filename}`);
      
      // Convert the image to a blob and upload to Firebase
      const response = await fetch(localUri);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // First, get device type from ML model
      const formData = new FormData();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      
      formData.append('file', {
        uri: localUri,
        name: filename,
        type: type,
      });
      
      // Get device type from ML model
      const mlResponse = await axios.post(
        'https://flaskapp-613599475137.asia-east2.run.app/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (!mlResponse.data || !mlResponse.data.predicted_class) {
        throw new Error('Device type not detected from the image');
      }
  
      // Send device data to addDevice endpoint
      const deviceData = {
        deviceType: mlResponse.data.predicted_class.trim(),
        deviceName: mlResponse.data.predicted_class.trim(),
        userId: userId,
        imageUrl: downloadURL  // Adding the image URL to the device data
      };
  
      const addDeviceResponse = await axios.post(
        'https://cloudrunservice-254131401451.us-central1.run.app/user/addDevice',
        deviceData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Device added successfully:', addDeviceResponse.data);
      Alert.alert('Success', 'Device added successfully!');
  
      // Navigate to devices screen
      router.replace({
        pathname: '/devices',
        params: {
          deviceType: mlResponse.data.predicted_class,
          imageUrl: downloadURL
        }
      });
  
      setUploading(false);
      return { downloadURL, mlResponse: mlResponse.data };
  
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to process image');
      setUploading(false);
      Alert.alert('Error', error.response?.data?.message || 'Failed to process image');
      return null;
    }
  };

  const pickImageFromGallery = async () => {
    try {
      setError(null);
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Gallery permission is required to select images');
        return;
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      setError('Failed to select image. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Device</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>
            Take a photo or select an image of your electronic device
          </Text>

          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={styles.changeImageButton} 
                  onPress={showImageSourceOptions}
                >
                  <Ionicons name="camera-outline" size={20} color="#609966" />
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePlaceholder}
              onPress={showImageSourceOptions}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={48} color="#609966" />
              <Text style={styles.placeholderText}>Tap to add a photo</Text>
              <Text style={styles.placeholderSubtext}>
                Take a clear photo of your device
              </Text>
            </TouchableOpacity>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.instructionContainer}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionIcon}>
                <Ionicons name="camera-outline" size={24} color="#609966" />
              </View>
              <Text style={styles.instructionText}>
                Take a clear photo of your electronic device
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionIcon}>
                <Ionicons name="cloud-upload-outline" size={24} color="#609966" />
              </View>
              <Text style={styles.instructionText}>
                Upload it to identify the device type
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionIcon}>
                <Ionicons name="leaf-outline" size={24} color="#609966" />
              </View>
              <Text style={styles.instructionText}>
                Get recycling options and environmental impact information
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {image ? (
          <TouchableOpacity
            style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
            onPress={() => handleUploadImage(image)}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.submitButtonText}>Upload and Identify Device</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={showImageSourceOptions}
          >
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.submitButtonText}>Add Device Image</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
  
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  contentContainer: {
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imageActions: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  changeImageText: {
    color: '#609966',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#609966',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(96, 153, 102, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    color: '#609966',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  placeholderSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
  },
  instructionContainer: {
    marginTop: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(96, 153, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#609966',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#609966',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#B8D8B8',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default Deviceinfo;