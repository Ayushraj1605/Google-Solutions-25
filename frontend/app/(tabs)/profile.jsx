import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import CustomButton from '../../components/customButton';
import { useNavigation, CommonActions } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation(); // Ensure the navigation prop is available

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
      <CustomButton
        title="Log Out"
        handlePress={OnClickHandler}
        containerStyles="mt-10 bg-smallText" // Apply custom styles if needed
      />
    </View>
  );
};

export default Profile;
