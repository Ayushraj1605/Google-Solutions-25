import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import React from 'react';
import ButtonProfile from '../../components/buttonProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';


const Profile = () => {
  const navigation = useNavigation();
  const OnClickHandler = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      console.log('All AsyncStorage data has been cleared!');

      // Reset navigation state and navigate to the SignIn screen in the Auth stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0, // Start at the first screen in the stack
          routes: [
            { name: '(auth)', params: { screen: 'signIn' } }, // Navigate to (auth)/signIn
          ],
        })
      );
    } catch (error) {
      console.error('Error clearing AsyncStorage or navigating:', error);
    }
  };

  return (
    <View>
      <Text>profiless</Text>
    </View>
  );
};

export default profile
