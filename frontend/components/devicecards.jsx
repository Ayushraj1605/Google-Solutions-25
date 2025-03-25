import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions,
  Modal,
  ScrollView 
} from 'react-native';
import { router } from 'expo-router';
import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

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

// Keeping all your utility functions the same
const parseFormattedList = (inputText) => {
  if (!inputText || typeof inputText !== 'string') {
    return { title: '', items: [] };
  }

  // Split the input text into lines
  const lines = inputText.split('\n').filter(line => line.trim());
  
  let title = '';
  const items = [];
  
  // Extract title (any text before the first bullet point)
  if (lines.length > 0) {
    const titleMatch = lines[0].match(/^\s*\*\*([^:*]+):\*\*\s*$/);
    if (titleMatch) {
      title = titleMatch[1].trim();
      lines.shift(); // Remove the title line
    } else if (!lines[0].includes('*')) {
      title = lines[0].trim();
      lines.shift(); // Remove the title line
    }
  }
  
  // Process list items
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Match main bullet points (first level)
    const mainPointMatch = line.match(/^\s*\*\s+\*\*([^:*]+):\*\*/);
    if (mainPointMatch) {
      const mainPoint = mainPointMatch[1].trim();
      
      // Look for the description that follows
      let description = '';
      
      // Check if description is on the same line
      const descMatch = line.match(/\*\*([^:*]+):\*\*\s+(.*)/);
      if (descMatch && descMatch[2]) {
        description = descMatch[2].trim();
      } 
      // Check if description is on the next line(s)
      else if (i + 1 < lines.length) {
        let nextIndex = i + 1;
        while (nextIndex < lines.length && !lines[nextIndex].match(/^\s*\*\s+\*\*/)) {
          if (description) description += ' ';
          description += lines[nextIndex].trim();
          nextIndex++;
        }
        i = nextIndex - 1; // Adjust i to skip the description lines
      }
      
      items.push({
        key: mainPoint,
        value: description
      });
    }
    i++;
  }
  
  return { title, items };
};

const formatParsedList = (parsedData) => {
  const { title, items } = parsedData;
  
  let result = title ? `${title}\n` : '';
  
  items.forEach(item => {
    result += `  -${item.key}: ${item.value}\n`;
  });
  
  return result.trim();
};

const formatText = (text) => {
  if (!text) return [];
  
  // Check if text seems to be a bullet point list
  if (text.includes('*   **') || text.match(/\*\s+\*\*/)) {
    // Process as a bullet point list
    const parsedData = parseFormattedList(text);
    
    // Create formatted sections from parsed data
    const sections = [];
    
    // Add title if it exists
    if (parsedData.title) {
      sections.push({
        isHeader: true,
        title: parsedData.title,
        content: ''
      });
    }
    
    // Add items as sections
    parsedData.items.forEach(item => {
      sections.push({
        isHeader: true,
        title: item.key,
        content: item.value
      });
    });
    
    return sections;
  }
  
  // Original formatting logic for non-bullet point text
  return text.split('\n\n').map(section => {
    // Check if section has a bold title format: "*Title:* Content"
    if (section.includes('') && section.includes(':')) {
      // Find the end of the bold title
      const titleEndIndex = section.indexOf(':');
      if (titleEndIndex !== -1) {
        // Extract title by removing asterisks
        const title = section.substring(0, titleEndIndex).replace(/\\/g, '').trim();
        // Extract content after the colon
        const content = section.substring(titleEndIndex + 2).replace(/\\/g, '').trim();
        
        return {
          isHeader: true,
          title: title,
          content: content
        };
      }
    }
    
    // Handle paragraphs that might contain bold formatting
    // Replace any remaining ** formatting in regular paragraphs
    const formattedContent = section.replace(/\\(.?)\\*/g, '$1').trim();
    
    return { 
      isHeader: false, 
      content: formattedContent 
    };
  });
};

const DeviceCard = ({ data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deviceTips, setDeviceTips] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  // const [imageUrl, setImageUrl] = useState(null);
  // Animation state for the pulse effect
  const [pulseAnimation, setPulseAnimation] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleRecyclePress = () => {
    setIsSubmitting(true);
    router.push('/recycleform');
    setIsSubmitting(false);
  };

  const handleViewDetails = async () => {
    try {
      // Set loading state
      setIsLoadingTips(true);
      
      // Start pulse animation
      startPulseAnimation();
      
      // Fetch recycling tips and information
      const response = await axios.post('https://cloudrunservice-254131401451.us-central1.run.app/user/deviceSuggestions', {
        deviceType: data?.deviceType || "generic"
      });
      
      setDeviceTips(response.data.suggestions);
      
      // Stop loading state
      setIsLoadingTips(false);
      
      // Show modal with the tips
      showModal();
    } catch(err) {
      console.error('Error fetching device details:', err);
      
      // Stop loading state
      setIsLoadingTips(false);
      
      // Navigate to details page as fallback
      router.push({
        pathname: '/device-details',
        params: { deviceId: data?.deviceId || "unknown" }
      });
    }
  };
  console.log(data);
  
  // Function to start pulse animation
  const startPulseAnimation = () => {
    // Start a pulse effect
    let pulseCount = 0;
    const interval = setInterval(() => {
      setPulseAnimation(prev => !prev);
      pulseCount++;
      if (pulseCount > 20 || !isLoadingTips) {
        clearInterval(interval);
        setPulseAnimation(false);
      }
    }, 500); // Pulse every 500ms
  };

  // Default values if data is incomplete
  const deviceName = data?.deviceName || "Eco-Friendly Recycling";
  const deviceType = data?.deviceType || "Make the world greener";
  const deviceId = data?.deviceId || "Unknown";
  const imageUrl = data?.imageUrl || "https://www.clipartmax.com/png/middle/167-1673712_green-recycling-symbol-green-recycle-logo-png.png";
  const recycleStatus = data?.recycleStatus || false;

  // useEffect(() => {
  //   const fetchDeviceImage = async () => {
  //     try {
  //       setImageLoading(true);
        
  //       // If we already have a full URL in data.imageUrl, use it directly
  //       if (data?.imageUrl && data.imageUrl.startsWith('http')) {
  //         setImageUrl(data.imageUrl);
  //         setImageLoading(false);
  //         return;
  //       }
        
  //       // Otherwise, we need to fetch it from Firebase Storage
  //       const storage = getStorage(firebaseConfig);
  //       let imagePath;
        
  //       // Get userId from AsyncStorage
  //       const userId = await AsyncStorage.getItem('ID');

  //       // If we have the image filename in data.imageUrl
  //       if (data?.imageUrl) {
  //         // If it's a full path, use it directly
  //         if (data.imageUrl.includes('DeviceImages/')) {
  //           imagePath = data.imageUrl;
  //         } else {
  //           // If it's just a filename, construct the path with userId
  //           const filename = data.imageUrl.split('/').pop();
  //           imagePath = `DeviceImages/${userId}/${filename}.jpg`;
  //         }
  //       } else if (data?.deviceId) {
  //         // If no imageUrl but we have deviceId, try to use that
  //         imagePath = `DeviceImages/${userId}/${data.deviceId}.jpg`;
  //       } else {
  //         // No identifiable information, use a default image
  //         setImageUrl(null);
  //         setImageLoading(false);
  //         return;
  //       }
        
  //       // Get the download URL from Firebase Storage
  //       const imageRef = ref(storage, imagePath);
  //       const url = await getDownloadURL(imageRef);
  //       setImageUrl(url);
  //     } catch (error) {
  //       console.error('Error fetching device image:', error);
  //       setImageUrl(null);
  //     } finally {
  //       setImageLoading(false);
  //     }
  //   };
    
  //   fetchDeviceImage();
  // }, [data?.imageUrl, data?.deviceId]);

  // Status indicator color
  const statusColor = recycleStatus ? '#FFB74D' : '#4CAF50';
  const statusText = recycleStatus ? "In Progress" : "Ready to Recycle";

  // Format tips for display
  const formattedTips = formatText(deviceTips);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Status indicator */}
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        <View style={styles.contentContainer}>
          {/* Left side: Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/svg/logo')} 
                style={styles.logo}
              />
            </View>
          </View>

          {/* Right side: Info */}
          <View style={styles.infoContainer}>
            {/* Device details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.title} numberOfLines={1}>{deviceName}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{deviceType}</Text>
              <View style={styles.idContainer}>
                <Text style={styles.idLabel}>ID:</Text>
                <Text style={styles.idValue}>{deviceId}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Action buttons - Now in a separate row beneath the card content */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[
              styles.detailsButton,
              pulseAnimation && styles.detailsButtonPulse,
              isLoadingTips && styles.detailsButtonLoading
            ]}
            onPress={handleViewDetails}
            activeOpacity={0.7}
            disabled={isLoadingTips}
          >
            {isLoadingTips ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#34C759" style={styles.loadingIndicator} />
                <Text style={styles.loadingText}>Loading Gemini Tips...</Text>
              </View>
            ) : (
              <Text style={styles.detailsButtonText}>Gemini assisted Reuse Tips</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Recycle button - Now outside the main card */}
      <TouchableOpacity 
        style={[
          styles.recycleButton, 
          recycleStatus && styles.recycleButtonDisabled
        ]}
        onPress={!recycleStatus ? handleRecyclePress : null}
        disabled={recycleStatus || isSubmitting}
        activeOpacity={recycleStatus ? 1 : 0.7}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.recycleButtonText}>
            {recycleStatus ? "Processing" : "Recycle"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Modal for device details and recycling tips */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{deviceName}</Text>
              <Text style={styles.modalSubtitle}>Recycling Information</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={hideModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Modal Content */}
            <ScrollView style={styles.modalContent}>
              {deviceTips ? (
                formattedTips.length > 0 ? (
                  formattedTips.map((section, index) => (
                    <View key={index} style={styles.section}>
                      {section.isHeader ? (
                        <>
                          <Text style={styles.sectionTitle}>{section.title}</Text>
                          <Text style={styles.sectionContent}>{section.content}</Text>
                        </>
                      ) : (
                        <Text style={styles.paragraphText}>{section.content}</Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.modalPlainText}>{deviceTips}</Text>
                )
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#34C759" />
                  <Text style={styles.loadingText}>Loading recycling information...</Text>
                </View>
              )}
            </ScrollView>
            
            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalRecycleButton}
                onPress={() => {
                  hideModal();
                  if (!recycleStatus) handleRecyclePress();
                }}
                disabled={recycleStatus}
              >
                <Text style={styles.modalButtonText}>
                  {recycleStatus ? "Already in Progress" : "Recycle Now"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
    marginVertical: 8,
  },
  container: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexDirection: 'row',
    height: 120, // Keep the main content height the same
  },
  imageContainer: {
    width: 120,
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 2,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  idValue: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  actionContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 36, // Ensure consistent height during loading
  },
  detailsButtonPulse: {
    backgroundColor: '#e6f7ed', // Light green background for pulse effect
  },
  detailsButtonLoading: {
    borderColor: '#34C759',
    borderWidth: 1,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  recycleButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  recycleButtonDisabled: {
    backgroundColor: '#888',
  },
  recycleButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modal styles remain unchanged
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingRight: 24, // Make room for close button
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
    maxHeight: '70%',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginLeft: 8,
  },
  paragraphText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  modalPlainText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  modalRecycleButton: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default DeviceCard;