import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
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
                    name: userName,
                    email: userEmail,
                });
                console.log('User data retrieved:', { id: userId, name: userName, email: userEmail });
            } catch (error) {
                console.error('Error retrieving user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const saveBlog = async () => {
        // Does not allow Empty Title or Content of Blog
        if (title.trim() === '' || desc.trim() === '') {
            Alert.alert("Error", "Title and content cannot be empty!");
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
                    Alert.alert("Success", "Blog saved successfully!", [
                        {
                            text: "OK",
                            onPress: () => router.back(), // Navigate back after user presses OK
                        },
                    ]);
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={90}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {params?.editing ? "Update Blog" : "Create New Blog"}
                    </Text>
                    <View style={{ width: 60 }} />
                </View>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter blog title..."
                    value={title}
                    onChangeText={setTitle}
                //setTitle("A") is called.
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Write your blog here..."
                    multiline
                    numberOfLines={5}
                    value={desc}
                    onChangeText={setDesc}
                />

                <TouchableOpacity style={styles.saveButton} onPress={saveBlog}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#bfd6c1',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },

    backButton: {
        fontSize: 16,
        color: '#609966',
        width: 60,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginBottom: 5,
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        height: 150,
        textAlignVertical: 'top',
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        width: 100,
        alignSelf: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BlogScreen;
