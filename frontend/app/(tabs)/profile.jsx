import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import ButtonProfile from '../../components/buttonProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import ProfileImage from '../../components/profileAvatar';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared!');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: '(auth)', params: { screen: 'signIn' } }],
        })
      );
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar barStyle="light-content" backgroundColor="#609966" />

      {/* Header */}
      <View
        style={{
          backgroundColor: '#609966',
          paddingHorizontal: 24,
          paddingVertical: 50,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          height: 150,
        }}
      >
        {/* <Text style={{ color: '#fff', fontSize: 32, fontWeight: '800' }}>
          My Profile
        </Text> */}
      </View>

      {/* Profile Card */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          marginHorizontal: 20,
          marginTop: -50,
          padding: 24,
          borderRadius: 24,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <ProfileImage name="Ayush" />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#1F2937' }}>
            Ayush Raj
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 16 }}>
            theboys.ewaste@gmail.com
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ fontSize: 32, color: '#9CA3AF' }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
        <ButtonProfile title="Order History" onPress={() => {}} />
        <View style={{ height: 20 }} />
        <ButtonProfile title="Sign Out" handlePress={handleSignOut} />
      </View>
    </View>
  );
};

export default ProfileScreen;
