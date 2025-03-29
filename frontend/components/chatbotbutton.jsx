// components/FloatingButton.jsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon library
import { router } from 'expo-router'; // Import router from expo-router
const ChatBotButton = ({ onPress }) => {
  const navigation = useNavigation();
  
  // Default action if no onPress is provided
  const handlePress = onPress || (() => {
      router.push('/chatbot'); // Navigate to the chatbot screen
    });

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.button} onPress={handlePress}> */}
      <TouchableOpacity className={`rounded-full min-h-[62px] w-11/12 justify-center items-center `} onPress={handlePress} style={styles.button}>
        <Icon name="chat" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    
    zIndex: 999, // Ensure it stays on top
  },
  button: {
    // position: 'absolute',
    // right: 16,
    // bottom: 90,
    backgroundColor: '#609966',
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

export default ChatBotButton;