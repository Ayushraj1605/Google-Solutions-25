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
import axios from 'axios';
import { use } from 'react';

const { width } = Dimensions.get('window');

// Format text function simplified to only what's needed
const formatText = (text) => {
  if (!text) return [];

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
    const formattedContent = section.replace(/\\(.?)\\*/g, '$1').trim();

    return {
      isHeader: false,
      content: formattedContent
    };
  });
};

const DeviceCard = ({ data, onStatusUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isInDonation, setIsInDonation] = useState(false);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deviceTips, setDeviceTips] = useState('');
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const isInDonation = data?.status === "InDonation";
  // Improved console logs for debugging
  // console.log('Device data:', data);
  // console.log('Device status (type):', typeof data?.status, data?.status);
  // console.log('Device ID:', data?.deviceId || data?.deviceID);
  // console.log('Device type:', data?.deviceType);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleRecyclePress = () => {
    setIsSubmitting(true);
    console.log('Recycling device with ID:', data.deviceId || data.deviceID);
    router.push(`/recycleform?deviceId=${data.deviceId || data.deviceID}`)
    setIsSubmitting(false);
  };

  // const handleDonatePress = async () => {
  //   setIsDonating(true);
  //   // console.log('Donating device with ID:', data.deviceId || data.deviceID);
  //   try {
  //     let endpoint, requestMethod;
  //     endpoint = `https://cloudrunservice-254131401451.us-central1.run.app/user/donateDevice?deviceId=${data.deviceId || data.deviceID}`;
  //     requestMethod = 'put';
  //     const { status } = await axios({
  //       method: requestMethod,
  //       url: endpoint,
  //       headers: {
  //         "Content-Type": "application/json",
  //       }
  //     });

  //   }
  //   catch {
  //     console.error('Error donating device:', error);
  //     Alert.alert("Error", `Failed to donating device. Please try again.`);
  //   } finally {
  //     setIsDonating(false);
  //   }
  // };
  const handleDonatePress = async () => {
    setIsDonating(true);
    try {
      // Optimistically update UI
      if (onStatusUpdate) {
        onStatusUpdate(data.deviceId || data.deviceID, "InDonation");
      }

      const endpoint = `https://cloudrunservice-254131401451.us-central1.run.app/user/donateDevice?deviceId=${data.deviceId || data.deviceID}`;

      await axios({
        method: 'put',
        url: endpoint,
        headers: { "Content-Type": "application/json" }
      });

      // Optional: Refresh data from server if needed
      // You could trigger a refresh here if you prefer

    } catch (error) {
      console.error('Error donating device:', error);
      // Revert UI if API call fails
      if (onStatusUpdate) {
        onStatusUpdate(data.deviceId || data.deviceID, "Ready");
      }
      Alert.alert("Error", "Failed to donate device. Please try again.");
    } finally {
      setIsDonating(false);
    }
  };


  const handleViewDetails = async () => {
    try {
      setIsLoadingTips(true);
      startPulseAnimation();

      console.log('Fetching suggestions for device type:', data?.deviceType || "generic");

      const response = await axios.post('https://cloudrunservice-254131401451.us-central1.run.app/user/deviceSuggestions', {
        deviceType: data?.deviceType || "generic"
      });

      console.log('Received suggestions:', response.data.suggestions ? 'Success' : 'Empty');
      setDeviceTips(response.data.suggestions);
      setIsLoadingTips(false);
      showModal();
    } catch (err) {
      console.error('Error fetching device details:', err);
      setIsLoadingTips(false);
      router.push({
        pathname: '/device-details',
        params: { deviceId: data?.deviceId || data?.deviceID || "unknown" }
      });
    }
  };

  // Function to start pulse animation
  const startPulseAnimation = () => {
    let pulseCount = 0;
    const interval = setInterval(() => {
      setPulseAnimation(prev => !prev);
      pulseCount++;
      if (pulseCount > 20 || !isLoadingTips) {
        clearInterval(interval);
        setPulseAnimation(false);
      }
    }, 500);
  };

  // Default values if data is incomplete
  const deviceName = data?.deviceName || "Eco-Friendly Recycling";
  const deviceType = data?.deviceType || "Make the world greener";
  const deviceId = data?.deviceId || data?.deviceID || "Unknown";
  const imageUrl = data?.imageUrl || "https://www.clipartmax.com/png/middle/167-1673712_green-recycling-symbol-green-recycle-logo-png.png";

  // Check if status indicates the device is in progress
  // If status is a string, we need to check for values that mean "in progress"
  const recycleStatus = data?.status ? data.status !== "" : false;

  // Determine if the device is in a recycling state based on status string
  const isInRecyclingProcess = recycleStatus && data?.status !== "Ready";
  // const isInDonation = data?.status === "InDonation";
  console.log(data?.status);
  // const isInDonation=donationStatus && data?.status!=="InDonation";
  // Status indicator color - adjust based on your actual status values
  const statusColor = isInRecyclingProcess ? '#FFB74D' : '#4CAF50';
  const statusText = isInRecyclingProcess ? "In Progress" : "";

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

              </View><TouchableOpacity
                style={[
                  styles.donateButton,
                  isInDonation && styles.donateButtonDisabled
                ]}
                onPress={isInDonation ? null : handleDonatePress}
                disabled={isInDonation || isDonating}
                activeOpacity={isInDonation ? 0.7 : 1}
              >
                {isDonating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.donateButtonText}>
                    {isInDonation ? "In Donation Queue" : "Donate"}
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={styles.statusInfoText}>Status: {data?.status || "Ready to Recycle"}</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
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
              <View style={styles.buttonContent}>
                <Image
                  source={require('../assets/gemini-icon.png')}
                  style={styles.geminiIcon}
                />
                <Text style={styles.detailsButtonText}>Gemini assisted Reuse Tips</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>
      </View>

      {/* Recycle button - Now outside the main card */}
      <TouchableOpacity
        style={[
          styles.recycleButton,
          isInRecyclingProcess && styles.recycleButtonDisabled
        ]}
        onPress={!isInRecyclingProcess ? handleRecyclePress : null}
        disabled={isInRecyclingProcess || isSubmitting}
        activeOpacity={isInRecyclingProcess ? 1 : 0.7}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.recycleButtonText}>
            {isInRecyclingProcess ? "Processing" : "Recycle"}
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
                  if (!isInRecyclingProcess) handleRecyclePress();
                }}
                disabled={isInRecyclingProcess}
              >
                <Text style={styles.modalButtonText}>
                  {isInRecyclingProcess ? "Already in Progress" : "Recycle Now"}
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
  // Styles remain unchanged
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
  statusInfoText: {
    fontSize: 11,
    color: '#555',
    marginTop: 4,
  },
  contentContainer: {
    flexDirection: 'row',
    height: 120,
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
    minHeight: 36,
  },
  detailsButtonPulse: {
    backgroundColor: '#e6f7ed',
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
  donateButton: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  donateButtonDisabled: {
    backgroundColor: '#888',
  },
  donateButtonText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  recycleButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
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
    paddingRight: 24,
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
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  geminiIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  }
});

export default DeviceCard;