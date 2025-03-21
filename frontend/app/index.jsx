import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from './(auth)/loader';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('TOKEN');

        if (value) {
          const [retrievedRole] = value.split(' ');

          if (retrievedRole === 'org') {
            router.replace('/homeOrg');
          } else {
            router.replace('/home');
          }
        } else {
          router.replace('/signIn');
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        router.replace('/signIn');
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <SafeAreaView className="h-full bg-black">
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Loader />
    </SafeAreaView>
  );
};

export default Index;