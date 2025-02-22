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
  const [role, setRole] = useState(null); // State to store user role

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
      const value = await AsyncStorage.getItem('TOKEN'); // Retrieve token saved during SignIn
      if (value !== null) {
        console.log('Retrieved token:', value); // Log the retrieved value

        const [retrievedRole, token] = value.split(' '); // Split to extract role and token
        setRole(retrievedRole); // Set role in state
        setUserToken(token); // Set token in state
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
              {/* Redirect based on role */}
              <Text className="text-2xl font-bold text-center text-green-600">Welcome Back!</Text>
              <Link
                href={role === 'org' ? 'homeOrg' : 'home'} // Conditional redirection
                className="text-3xl text-white bg-green-500 font-bold py-2 px-6 rounded-xl mt-4"
                style={{ textAlign: 'center' }}
              >
                Go to {role === 'org' ? 'Organization' : 'User'} Home
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
