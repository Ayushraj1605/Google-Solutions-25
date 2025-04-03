import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BlogScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState(params?.title || '');
  const [desc, setDesc] = useState(params?.body || '');
  const [isEditing] = useState(!!params?.editing);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Calculate word count
    const words = desc.trim() ? desc.trim().split(/\s+/).length : 0;
    setWordCount(words);
    
    // Calculate character count
    setCharacterCount(desc.length);
  }, [desc]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('ID');
        const userName = await AsyncStorage.getItem('USERNAME');
        const userEmail = await AsyncStorage.getItem('EMAIL');

        setUserData({
          id: userId || '',
          name: userName,
          email: userEmail,
        });
      } catch (error) {
        console.error('Error retrieving user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const saveBlog = async () => {
    // Validate inputs
    if (title.trim() === '') {
      Alert.alert("Missing Title", "Please enter a title for your blog post.");
      return;
    }

    if (desc.trim() === '') {
      Alert.alert("Missing Content", "Please write some content for your blog post.");
      return;
    }

    if (!userData.id) {
      Alert.alert("Authentication Error", "User ID not found. Please log in again.");
      return;
    }

    setIsSaving(true);

    try {
      let endpoint, requestMethod, requestData;
      
      if (isEditing) {
        endpoint = `https://cloudrunservice-254131401451.us-central1.run.app/user/updateBlog?blogId=${params?.blogId}`;
        requestMethod = 'put';
        requestData = {
          userId: params?.userId,
          title: title,
          body: desc,
          blogId: params?.blogId,
        };
      } else {
        endpoint = `https://cloudrunservice-254131401451.us-central1.run.app/user/blogs?userId=${userData.id}`;
        requestMethod = 'post';
        requestData = {
          title: title,
          body: desc
        };
      }

      const { status } = await axios({
        method: requestMethod,
        url: endpoint,
        data: requestData,
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (status === 200) {
        Alert.alert(
          "Success", 
          `Blog post ${isEditing ? 'updated' : 'created'} successfully!`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      Alert.alert("Error", `Failed to ${isEditing ? 'update' : 'save'} blog. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (title.trim() !== '' || desc.trim() !== '') {
                Alert.alert(
                  "Discard Changes?",
                  "You have unsaved changes. Are you sure you want to leave?",
                  [
                    { text: "Stay", style: "cancel" },
                    { text: "Discard", onPress: () => router.back() }
                  ]
                );
              } else {
                router.back();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Blog Post' : 'Create New Blog'}
          </Text>
          
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => setShowStats(!showStats)}
          >
            <Ionicons name="information-circle-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {showStats && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Blog Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{characterCount}</Text>
                <Text style={styles.statLabel}>Characters</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{wordCount}</Text>
                <Text style={styles.statLabel}>Words</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.ceil(wordCount / 200)}</Text>
                <Text style={styles.statLabel}>Min read</Text>
              </View>
            </View>
          </View>
        )}

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Author info card */}
            <View style={styles.authorCard}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorInitial}>{userData.name?.charAt(0) || 'U'}</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{userData.name || 'User'}</Text>
                <Text style={styles.draftText}>
                  {isEditing ? 'Editing draft' : 'New draft'}
                </Text>
              </View>
            </View>

            {/* Title input */}
            <View style={styles.inputContainer}>
              <Ionicons name="document-text-outline" size={22} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.titleInput}
                placeholder="Enter a compelling title..."
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Content input */}
            <View style={styles.contentContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Write your blog content here..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={10}
                value={desc}
                onChangeText={setDesc}
                textAlignVertical="top"
              />
            </View>

            {/* Formatting toolbar */}
            <View style={styles.toolbar}>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="text" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="list" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="link" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="image-outline" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarButton}>
                <Ionicons name="code-slash" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Tags section */}
            <View style={styles.tagsSection}>
              <Text style={styles.tagsLabel}>
                <Ionicons name="pricetag-outline" size={16} color="#4CAF50" /> Add tags (optional)
              </Text>
              <View style={styles.tagContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>lifestyle</Text>
                  <TouchableOpacity>
                    <Ionicons name="close-circle" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagInputContainer}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="Add a tag..."
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>

            {/* Spacer for bottom action buttons */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>

        {/* Bottom action buttons */}
        {!keyboardVisible && (
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.draftButton}>
              <Text style={styles.draftButtonText}>Save Draft</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.publishButton} 
              onPress={saveBlog}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.publishButtonText}>
                    {isEditing ? 'Update' : 'Publish'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={styles.buttonIcon} />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F9F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
  },
  infoButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  draftText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputIcon: {
    marginRight: 10,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    padding: 10,
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textArea: {
    fontSize: 16,
    color: '#333',
    padding: 16,
    minHeight: 200,
    lineHeight: 24,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  toolbarButton: {
    padding: 8,
    borderRadius: 4,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4CAF50',
    marginRight: 4,
  },
  tagInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagInput: {
    minWidth: 100,
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  draftButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  draftButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 16,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  bottomSpacer: {
    height: 100, // Ensures content can scroll above bottom actions
  },
});

export default BlogScreen;