import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { LocalRouteParamsContext, Route } from 'expo-router/build/Route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { use } from 'react';
const BlogScreen = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    // const [title, setTitle] = useState('');
    const [title, setTitle] = useState(params?.title || '');
    // useState hook for storing the variable title and content of blog
    const [desc, setDesc] = useState(params?.body || '');

    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    // const [title, setTitle] = useState('');

    // const saveBlog = async () =>  {

    //     // Does not allow Empty Title or Content of Blog
    //     if (title.trim() === '' || content.trim() === '') {
    //         Alert.alert("Error", "Title and content cannot be empty!");
    //         return;
    //     }

    //     // We need to either add to the existing array or use a json or database for storing blogs
    //     // make a post request to 'https://cloudrunservice-254131401451.us-central1.run.app/user/blog/'
    //     const endpoint=`https://cloudrunservice-254131401451.us-central1.run.app/user/blog?userId`
    //     const { data, status } = await axios.post(endpoint, {title:title, description:desc});
    //     if(status==200)
    //         Alert.alert("Success", "Blog saved successfully!");
    // };
    // Fetch user data (including userId) on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem('ID');
                const userName = await AsyncStorage.getItem('USERNAME');
                const userEmail = await AsyncStorage.getItem('EMAIL');

        setUserData({
          id: userId || '',
          name: userName || '',
          email: userEmail || '',
        });
      } catch (error) {
        console.error('Error retrieving user data:', error);
        Alert.alert("Error", "Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveBlog = async () => {
    if (isSubmitting) return;
    
    // Validation
    if (title.trim() === '') {
      Alert.alert("Validation Error", "Please enter a title for your blog");
      return;
    }
    
    if (desc.trim() === '') {
      Alert.alert("Validation Error", "Please write your blog content");
      return;
    }

        if (!userData.id) {
            Alert.alert("Error", "User ID not found. Please log in again.");
            return;
        }
        if (params?.editing) {
            try {
                // console.log(desc);
                const endpoint = `https://cloudrunservice-254131401451.us-central1.run.app/user/updateBlog?blogId=${params?.blogId}`;
                const { data, status } = await axios.put(
                    endpoint,
                    {
                      userId: params?.userId,
                      title: title,
                      body: desc,
                      blogId: params?.blogId,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json", // Explicitly set headers
                      },
                    }
                  );

                if (status === 200) {
                    Alert.alert("Success", "Blog saved successfully!");
                }
            } catch (error) {
                console.error('Error saving blog:', error);
                Alert.alert("Error", "Failed to save blog. Please try again.");
            }
        }
        else {
            try {
                // console.log(desc);
                const endpoint = `https://cloudrunservice-254131401451.us-central1.run.app/user/blogs?userId=${userData.id}`;
                const { data, status } = await axios.post(endpoint, {
                    title: title,
                    body: desc
                });

                if (status === 200) {
                    Alert.alert("Success", "Blog saved successfully!");
                }
            } catch (error) {
                console.error('Error saving blog:', error);
                Alert.alert("Error", "Failed to save blog. Please try again.");
            }
        }
    };
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Create New Blog</Text>
          
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What's your blog about?"
              placeholderTextColor="#9E9E9E"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              returnKeyType="next"
              autoCapitalize="words"
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Story</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Share your thoughts..."
              placeholderTextColor="#9E9E9E"
              multiline
              numberOfLines={8}
              value={desc}
              onChangeText={setDesc}
              textAlignVertical="top"
              blurOnSubmit={true}
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSaveBlog}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Publish Blog</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    height: 200,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BlogScreen;