import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import React from 'react';
import ButtonProfile from '../../components/buttonProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import ProfileImage from '../../components/profileAvatar';


const profile = () => {
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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor="#609966" />

      {/* Green Header */}
      <View style={{
        backgroundColor: '#609966',
        height: 120,
        paddingHorizontal: 24,
        paddingTop: 32
      }}>
        <Text style={{
          color: 'white',
          fontSize: 24,
          fontWeight: '600'
        }}>
          My Profile
        </Text>
      </View>

      {/* Profile Card */}
      <View style={{
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: -16,
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#E0E0E0'
          }} /> */}
          <ProfileImage name="Surbhi Dighe" />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Ayush Raj</Text>
            <Text style={{ color: '#666666' }}>theboys.ewaste@gmail.com</Text>
          </View>
          <TouchableOpacity>
            <Text style={{ fontSize: 24, color: '#666666' }}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Options */}
      <View style={{ marginHorizontal: 16, marginTop: 24 }}>
        {/* Order History */}
        <ButtonProfile
          title="Order History"
          onPress={OnClickHandler}
        />

        {/* Sign Out */}
        <ButtonProfile
          title="Sign Out"
          handlePress={OnClickHandler}
        />

      </View>
    </View>
  );
};

export default profile;