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

const { width } = Dimensions.get('window');

/**
 * Parser to convert complex nested bullet point lists to a simplified format
 */
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

/**
 * Format the parsed data into the desired output format
 */
const formatParsedList = (parsedData) => {
  const { title, items } = parsedData;
  
  let result = title ? `${title}\n` : '';
  
  items.forEach(item => {
    result += `  -${item.key}: ${item.value}\n`;
  });
  
  return result.trim();
};

/**
 * Format text for better display
 */
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
  const [visible, setVisible] = useState(false);
  const [deviceTips, setDeviceTips] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleRecyclePress = () => {
    setIsSubmitting(true);
    router.push('/recycleform');
    setIsSubmitting(false);
  };

  const handleViewDetails = async () => {
    try {
      // Fetch recycling tips and information
      const response = await axios.post('https://cloudrunservice-254131401451.us-central1.run.app/user/deviceSuggestions', {
        deviceType: data?.deviceType || "generic"
      });
      setDeviceTips(response.data.suggestions);
      showModal();
    } catch(err) {
      console.error('Error fetching device details:', err);
      // Navigate to details page as fallback
      router.push({
        pathname: '/device-details',
        params: { deviceId: data?.deviceId || "unknown" }
      });
    }
  };

  // Default values if data is incomplete
  const deviceName = data?.deviceName || "Eco-Friendly Recycling";
  const deviceType = data?.deviceType || "Make the world greener";
  const imageUrl = data?.imageUrl || 'https://picsum.photos/700';
  const deviceId = data?.deviceId || "Unknown";
  const recycleStatus = data?.recycleStatus || false;

  // Status indicator color
  const statusColor = recycleStatus ? '#FFB74D' : '#4CAF50';
  const statusText = recycleStatus ? "In Progress" : "Ready to Recycle";

  // Format tips for display
  const formattedTips = formatText(deviceTips);

  return (
    <>
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

          {/* Right side: Info and buttons */}
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

            {/* Action buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={handleViewDetails}
                activeOpacity={0.7}
              >
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>

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
            </View>
          </View>
        </View>
      </View>

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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    height: 120, // Fixed compact height
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
    height: '100%',
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
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  recycleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  recycleButtonDisabled: {
    backgroundColor: '#888',
  },
  recycleButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modal styles
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
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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