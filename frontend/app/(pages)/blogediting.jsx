import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView,Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const BlogScreen = () => {
    const router=useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const handleSave = () => {
        if (title.trim() === '' || content.trim() === '') {
            Alert.alert("Error", "Title and content cannot be empty!");
            return;
        }

        console.log("Saved Blog:", { title, content });
        Alert.alert("Success", "Blog saved successfully!");

        // You can integrate API or local storage here.
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
                    <Text style={styles.headerTitle}>Chat Assistant</Text>
                    <View style={{ width: 60 }} />
                </View>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter blog title..."
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Content</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Write your blog here..."
                    multiline
                    numberOfLines={5}
                    value={content}
                    onChangeText={setContent}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
        marginTop:20,
        marginRight:10,
        marginLeft:10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop:20,
        marginRight:10,
        marginLeft:10,
        backgroundColor: '#fff',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        height: 150,
        textAlignVertical: 'top',
        marginTop:20,
        marginRight:10,
        marginLeft:10,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop:20,
        marginRight:10,
        marginLeft:10,
        width:100,
        alignSelf:'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BlogScreen;
