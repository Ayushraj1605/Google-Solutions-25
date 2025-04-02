// components/FloatingButton.jsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon library
import { router } from 'expo-router'; // Import router from expo-router
import { Ionicons } from '@expo/vector-icons';
const BlogEditButton = ({ onPress }) => {
  const navigation = useNavigation();
  
  // Default action if no onPress is provided
  const handlePress = onPress || (() => {
      router.push('/blogediting'); // Navigate to the chatbot screen
    });

  return (
    <View>
      {/* <TouchableOpacity style={styles.button} onPress={handlePress}> */}
      <TouchableOpacity className={`rounded-full min-h-[62px] w-11/12 justify-center items-center `} onPress={handlePress} style={styles.button}>
        <Icon name="edit" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius:16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default BlogEditButton;