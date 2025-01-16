import { Text, View, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Loader from './(auth)/laoder';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);  // State to manage loader

  useEffect(() => {
    // Show loader for 1 second
    const loaderTimeout = setTimeout(() => {
      setIsLoading(false);  // Hide loader
    }, 1000); // 1 second delay

    // Cleanup timeout if component unmounts
    return () => clearTimeout(loaderTimeout);
  }, []);

  return (
    <SafeAreaView
      className={`h-full ${isLoading ? 'bg-black' : 'bg-white'}`} // Dynamic background color
    >
      {/* Change status bar color based on isLoading */}
      <StatusBar barStyle={isLoading ? 'light-content' : 'dark-content'} backgroundColor={isLoading ? 'black' : 'white'} />

      <ScrollView contentContainerStyle={{ height: '100%', justifyContent: 'center' }}>
        <View className="w-full justify-center items-center h-full px-4">
          {isLoading ? (
            <Loader />  // Show loader initially
          ) : (
            <>
              {/* Actual content appears after 1 second */}
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
