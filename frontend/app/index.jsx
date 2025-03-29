import { StatusBar, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from './(auth)/loader';

const Index = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const MIN_LOADER_TIME = 2500; // 2.5 seconds minimum loading time

  useEffect(() => {
    const startTime = Date.now();
    
    const checkAuthStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('TOKEN');
        let route = '/signIn';
        
        if (value) {
          const [retrievedRole] = value.split(' ');
          route = retrievedRole === 'org' ? '/homeOrg' : '/home';
        }

        // Calculate how much time has elapsed
        const elapsedTime = Date.now() - startTime;
        
        // If less than minimum time has passed, wait the remaining time
        if (elapsedTime < MIN_LOADER_TIME) {
          const remainingTime = MIN_LOADER_TIME - elapsedTime;
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Now navigate
        router.replace(route);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        
        // Still ensure minimum loading time even on error
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MIN_LOADER_TIME) {
          const remainingTime = MIN_LOADER_TIME - elapsedTime;
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        router.replace('/signIn');
      } finally {
        setIsLoading(false);
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