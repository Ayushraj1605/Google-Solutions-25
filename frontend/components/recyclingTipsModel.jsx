import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Modal, Portal, Card, Text, Button, IconButton, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RecyclingTipsModal = ({ visible, hideModal, deviceTips, deviceName, deviceType }) => {
  const [sections, setSections] = useState([]);

  // Parse the deviceTips string to create formatted sections
  useEffect(() => {
    if (deviceTips) {
      const parsedSections = parseRecyclingTips(deviceTips);
      setSections(parsedSections);
    }
  }, [deviceTips]);

  // Parse the recycling tips text into structured sections
  const parseRecyclingTips = (tips) => {
    if (!tips) return [];
    
    const lines = tips.split('\n').map(line => line.trim()).filter(line => line);
    const sections = [];
    let currentSection = null;
    let currentSubsection = null;
    let currentList = [];

    lines.forEach(line => {
      // Main section header (e.g., "**Simple & Easy (Minimal Disassembly):**")
      if (line.startsWith('**') && line.endsWith(':**')) {
        if (currentSection) {
          if (currentSubsection) {
            currentSection.subsections.push(currentSubsection);
            currentSubsection = null;
          }
          sections.push(currentSection);
        }
        
        currentSection = {
          title: line.replace(/\*\*/g, '').replace(':', ''),
          subsections: [],
          description: ''
        };
      }
      // Subsection header (e.g., "*   **Artistic Embellishment:**")
      else if (line.includes('*   **') && line.endsWith(':**')) {
        if (currentSubsection) {
          currentSection.subsections.push(currentSubsection);
        }
        
        currentSubsection = {
          title: line.replace(/\*/g, '').replace(/\*\*/g, '').trim().replace(':', ''),
          items: []
        };
      }
      // List items (e.g., "*   **Steampunk Mouse:**  Glue gears...")
      else if (line.includes('*   **') && !line.endsWith(':**')) {
        const parts = line.replace(/\*/g, '').split('**');
        const itemTitle = parts[1].replace(':', '').trim();
        const itemDescription = parts.slice(2).join('').trim();
        
        if (currentSubsection) {
          currentSubsection.items.push({
            title: itemTitle,
            description: itemDescription
          });
        }
      }
      // Regular list items (e.g., "*   **Donate it:** Often charities...")
      else if (line.startsWith('*   ')) {
        const content = line.replace('*   ', '');
        
        if (content.includes('**')) {
          const parts = content.split('**');
          const itemTitle = parts[1].replace(':', '').trim();
          const itemDescription = parts.slice(2).join('').trim();
          
          if (currentSection && !currentSubsection) {
            if (!currentSection.items) {
              currentSection.items = [];
            }
            currentSection.items.push({
              title: itemTitle,
              description: itemDescription
            });
          }
        } else {
          if (currentSubsection) {
            currentSubsection.items.push({
              description: content
            });
          } else if (currentSection) {
            if (!currentSection.items) {
              currentSection.items = [];
            }
            currentSection.items.push({
              description: content
            });
          }
        }
      }
      // Regular text description
      else if (currentSection && !line.startsWith('**')) {
        if (currentSection.description) {
          currentSection.description += ' ' + line;
        } else {
          currentSection.description = line;
        }
      }
    });

    // Add the last section and subsection if they exist
    if (currentSubsection) {
      currentSection.subsections.push(currentSubsection);
    }
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  // Get appropriate icon for section titles
  const getSectionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('simple') || lowerTitle.includes('easy')) {
      return 'circle-slice-1';
    } else if (lowerTitle.includes('moderate')) {
      return 'circle-slice-4';
    } else if (lowerTitle.includes('advanced')) {
      return 'circle-slice-8';
    } else if (lowerTitle.includes('tip')) {
      return 'lightbulb-outline';
    } else {
      return 'recycle';
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Title
            title={deviceName || "Recycling Tips"}
            subtitle={deviceType ? `How to recycle your ${deviceType}` : "Eco-friendly suggestions"}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="recycle"
                color="#fff"
                style={styles.headerIcon}
              />
            )}
            right={(props) => (
              <IconButton
                {...props}
                icon="close"
                size={24}
                onPress={hideModal}
                style={styles.closeButton}
              />
            )}
            titleStyle={styles.cardTitle}
            subtitleStyle={styles.cardSubtitle}
          />
          
          <Card.Content style={styles.content}>
            <ScrollView style={styles.scrollView}>
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <View key={index} style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <MaterialCommunityIcons 
                        name={getSectionIcon(section.title)} 
                        size={24} 
                        color="#34C759" 
                        style={styles.sectionIcon}
                      />
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    
                    {section.description ? (
                      <Text style={styles.sectionDescription}>{section.description}</Text>
                    ) : null}
                    
                    {section.items && section.items.length > 0 ? (
                      <View style={styles.itemsList}>
                        {section.items.map((item, itemIndex) => (
                          <View key={itemIndex} style={styles.item}>
                            {item.title ? (
                              <View style={styles.itemHeader}>
                                <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={16} color="#2196F3" />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                              </View>
                            ) : null}
                            {item.description ? (
                              <Text style={styles.itemDescription}>{item.description}</Text>
                            ) : null}
                          </View>
                        ))}
                      </View>
                    ) : null}
                    
                    {section.subsections && section.subsections.map((subsection, subIndex) => (
                      <View key={subIndex} style={styles.subsection}>
                        <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                        
                        {subsection.items && subsection.items.map((item, itemIndex) => (
                          <View key={itemIndex} style={styles.item}>
                            {item.title ? (
                              <View style={styles.itemHeader}>
                                <MaterialCommunityIcons name="circle-medium" size={16} color="#2196F3" />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                              </View>
                            ) : null}
                            {item.description ? (
                              <Text style={styles.itemDescription}>{item.description}</Text>
                            ) : null}
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <Text style={styles.noContent}>
                  No recycling tips available for this device. Please check back later.
                </Text>
              )}
            </ScrollView>
          </Card.Content>
          
          <Card.Actions style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={hideModal}
              style={styles.closeActionButton}
              labelStyle={styles.closeActionButtonLabel}
            >
              Close
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    elevation: 5,
    maxHeight: height * 0.8,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  headerIcon: {
    backgroundColor: '#34C759',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  closeButton: {
    margin: 8,
  },
  content: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  scrollView: {
    maxHeight: height * 0.6,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  subsection: {
    marginLeft: 16,
    marginBottom: 8,
    paddingTop: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  itemsList: {
    paddingLeft: 8,
  },
  item: {
    marginBottom: 4,
    paddingLeft: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2196F3',
    marginLeft: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 20,
  },
  noContent: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 24,
  },
  actions: {
    justifyContent: 'center',
    paddingVertical: 12,
  },
  closeActionButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#34C759',
  },
  closeActionButtonLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default RecyclingTipsModal;