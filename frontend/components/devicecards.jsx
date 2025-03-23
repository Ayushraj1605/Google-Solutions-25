import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Avatar, Button, Card, Text, Portal, Modal, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import axios from 'axios';

// This component is completely self-contained with no external imports
const Cards = ({ data }) => {
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

  const handleDetailsPress = async (deviceType) => {
    try {
      const response = await axios.post('https://cloudrunservice-254131401451.us-central1.run.app/user/deviceSuggestions', {
        deviceType: deviceType
      });
      setDeviceTips(response.data.suggestions);
      showModal();
      console.log(response.data.suggestions);
    } catch(err) {
      console.error('Error fetching devices:', err);
    }
  };
  
  // Format text for better display in the modal
  // Format text for better display in the modal
const formatText = (text) => {
  if (!text) return [];
  
  // Split text into sections by double newlines
  return text.split('\n\n').map(section => {
    // Check if section has a bold title format: "**Title:** Content"
    if (section.includes('**') && section.includes(':**')) {
      // Find the end of the bold title
      const titleEndIndex = section.indexOf(':**');
      if (titleEndIndex !== -1) {
        // Extract title by removing asterisks
        const title = section.substring(0, titleEndIndex).replace(/\*\*/g, '').trim();
        // Extract content after the colon
        const content = section.substring(titleEndIndex + 2).replace(/\*\*/g, '').trim();
        
        return {
          isHeader: true,
          title: title,
          content: content
        };
      }
    }
    
    // Handle paragraphs that might contain bold formatting
    // Replace any remaining ** formatting in regular paragraphs
    const formattedContent = section.replace(/\*\*(.*?)\*\*/g, '$1').trim();
    
    return { 
      isHeader: false, 
      content: formattedContent 
    };
  });
};
  
  const formattedTips = formatText(deviceTips);
  
  return (
    <>
      <Card style={styles.container} mode="elevated">
        <Card.Title
          title={data?.deviceName || "Eco-Friendly Recycling"}
          subtitle={data?.deviceType || "Make the world greener"}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="leaf"
              color="#fff"
              size={40}
              style={styles.avatar}
            />
          )}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
        <Card.Cover
          source={{ uri: data?.imageUrl || 'https://picsum.photos/700' }}
          style={styles.cover}
        />
        <Card.Content style={styles.content}>
          <Text variant="bodyMedium" style={styles.description}>
            Device ID: {data?.deviceId || "N/A"}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="outlined"
            textColor="#333"
            style={styles.buttonOutlined}
            labelStyle={styles.buttonLabel}
            onPress={() => handleDetailsPress(data?.deviceType)}
          >
            View Details
          </Button>
          <Button
            mode="contained"
            buttonColor={data?.recycleStatus ? '#888' : '#34C759'}
            textColor="#fff"
            style={styles.buttonContained}
            labelStyle={styles.buttonLabel}
            onPress={!data?.recycleStatus ? handleRecyclePress : null}
            disabled={data?.recycleStatus || isSubmitting}
          >
            {isSubmitting ? "Loading..." : (data?.recycleStatus ? "Recycle in Progress" : "Recycle")}
          </Button>
        </Card.Actions>
      </Card>

      {/* Inline modal for recycling tips */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <Card.Title
              title={data?.deviceName || "Device Details"}
              subtitle={data?.deviceType ? `Recycling tips for ${data.deviceType}` : "Recycling Tips"}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="recycle"
                  color="#fff"
                  size={40}
                  style={styles.headerIcon}
                />
              )}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  size={24}
                  onPress={hideModal}
                />
              )}
              titleStyle={styles.modalTitle}
              subtitleStyle={styles.modalSubtitle}
            />
            
            <Card.Content>
              <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
                    <Text style={styles.modalText}>{deviceTips}</Text>
                  )
                ) : (
                  <Text style={styles.noContentText}>
                    Loading recycling tips...
                  </Text>
                )}
              </ScrollView>
            </Card.Content>
            
            <Card.Actions style={styles.modalActions}>
              <Button 
                mode="contained"
                buttonColor="#34C759"
                textColor="#fff"
                onPress={hideModal}
                style={styles.closeButton}
              >
                Close
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    backgroundColor: '#34C759',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
  },
  cover: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  buttonOutlined: {
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonContained: {
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
  
  // Modal styles
  modalContainer: {
    margin: 20,
    maxHeight: height * 0.8,
  },
  modalCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 6,
  },
  headerIcon: {
    backgroundColor: '#34C759',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    maxHeight: height * 0.5,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 12,
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
  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noContentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 24,
  },
  modalActions: {
    justifyContent: 'center',
    paddingVertical: 12,
  },
  closeButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});

export default Cards;