import { Text, View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Loader from './(auth)/loader';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true); // State to manage loader
  const [userToken, setUserToken] = useState(null); // State to store retrieved token

  useEffect(() => {
    // Show loader and retrieve data from AsyncStorage
    const loaderTimeout = setTimeout(() => {
      _retrieveData(); // Call the AsyncStorage function
    }, 1000); // 1 second delay

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(loaderTimeout);
  }, []);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('TASK'); // Retrieve token saved during SignIn
      if (value !== null) {
        console.log('Retrieved token:', value); // Log the retrieved value
        setUserToken(value); // Set token to state
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    } finally {
      setIsLoading(false); // Hide loader after retrieval
    }
  };

  return (
    <SafeAreaView
      className={`h-full ${isLoading ? 'bg-black' : 'bg-white'}`} // Dynamic background color
    >
      {/* Change status bar color based on isLoading */}
      <StatusBar barStyle={isLoading ? 'light-content' : 'dark-content'} backgroundColor={isLoading ? 'black' : '#609966'} />

      <ScrollView contentContainerStyle={{ height: '100%', justifyContent: 'center' }}>
        <View className="w-full justify-center items-center h-full px-4">
          {isLoading ? (
            <Loader /> // Show loader initially
          ) : userToken ? (
            <>
              {/* Redirect to Home if token exists */}
              <Text className="text-2xl font-bold text-center text-green-600">Welcome Back!</Text>
              <Link
                href="home"
                className="text-3xl text-white bg-green-500 font-bold py-2 px-6 rounded-xl mt-4"
                style={{ textAlign: 'center' }}
              >
                Go to Home
              </Link>
            </>
          ) : (
            <>
              {/* Show Sign In if no token */}
              <Link
                href="signIn"
                className="text-6xl text-blue-600 font-bold py-2 px-6 bg-blue-100 rounded-xl"
                style={{ textAlign: 'center' }}
              >
                Sign In
              </Link>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
