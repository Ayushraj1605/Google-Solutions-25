import React, { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import "../global.css";
import { useFonts } from 'expo-font';

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // Load custom fonts
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  // Handle splash screen visibility
  useEffect(() => {
    if (error) throw error; // Throw error if fonts fail to load
    if (fontsLoaded) SplashScreen.hideAsync(); // Hide splash screen when fonts are loaded
  }, [fontsLoaded, error]);

  // Show nothing while fonts are loading
  if (!fontsLoaded && !error) return null;

  return (
    <>
      {/* StatusBar Configuration */}
      <StatusBar 
        barStyle="dark-content" // Black icons on light background
        backgroundColor="white" // Set the background color of the status bar
      />

      {/* Main Navigation Stack */}
      <Stack>
        {/* Index Screen */}
        <Stack.Screen
          name="index"
          options={{ headerShown: false }} // Hide the header for the main screen
        />

        {/* Authentication Stack */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false, // Hide the header for authentication screens
            gestureEnabled: false, // Disables swiping back to this stack
          }}
        />

        {/* Tabs Stack */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false, // Hide the header for tab-based screens
            gestureEnabled: false, // Disables swiping back to this stack
          }}
        />
        <Stack.Screen
          name="(pages)"
          options={{
            headerShown: false, // Hide the header for tab-based screens
            gestureEnabled: false, // Disables swiping back to this stack
          }}
        />
        <Stack.Screen
          name="(orgtabs)"
          options={{
            headerShown: false, // Hide the header for tab-based screens
            gestureEnabled: false, // Disables swiping back to this stack
          }}
        />
      </Stack>
    </>
  );
};

export default RootLayout;
