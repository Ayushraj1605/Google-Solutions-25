import { View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import ButtonProfile from '../../components/buttonProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import ProfileImage from '../../components/profileAvatar';
import { router } from 'expo-router';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);

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
        console.log('User data retrieved:', userData);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  const handleAnalytics = () => {
    console.log('User Analytics');
    router.push('/userAnalytics');
  }

  const handleOrders = () => {
    console.log('Order History');
    router.push('/orderHistory');
  }

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#609966"
        translucent={Platform.OS === 'ios'} 
      />
      {/* <SafeAreaView style={{ flex: 1, backgroundColor: Platform.OS === 'ios' ? '#609966' : '#F3F4F6' }}> */}
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
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
              paddingTop: Platform.OS === 'ios' ? 0 : 50,
            }}
          />

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
            <ProfileImage name={userData.name} />
            {console.log(userData.name)}
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#1F2937' }}>
                {userData.name}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 16 }}>
                {userData.email}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ fontSize: 32, color: '#9CA3AF' }}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Options */}
          <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
            <ButtonProfile title="Order History" handlePress={handleOrders} />
            <View style={{ height: 20 }} />
            <ButtonProfile title="Analytics" handlePress={handleAnalytics} />
            <View style={{ height: 20 }} />
            <ButtonProfile title="Sign Out" handlePress={handleSignOut} />
          </View>
        </View>
      {/* </SafeAreaView> */}
    </>
  );
};

export default ProfileScreen;