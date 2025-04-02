import { View, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect, Stack } from 'expo-router'
import Home from '../../assets/svg/home';
import Blogs from '../../assets/svg/blogs';
import Organisations from '../../assets/svg/organisations';
import Devices from '../../assets/svg/devices';
import Profile from '../../assets/svg/profile';
import Name from "../../assets/svg/name"; // This is importing an SVG component
import '../../global.css'
// import ChatbotButton from './chatbot';
import CustomButton from '../../components/customButton';

// This TabIcon component will handle the enlargement and green background
const TabIcon = ({ Component, focused }) => {
  return (
    <View style={{
      // Add padding for the background to show
      padding: 12,
      // Create a circular/rounded background when focused
      backgroundColor: focused ? '#4CAF50' : 'transparent',
      borderRadius: 24,
      // Scale the icon when focused
      transform: [{ scale: focused ? 1.2 : 1 }],
      // Center the icon in the background
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* No fill modification - keeping original icon color */}
      <Component />
    </View>
  )
}

const _layout = () => {
  return (
    <>
      <Tabs screenOptions={{
        // Hide tab labels for all tabs
        tabBarShowLabel: false
      }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: true,
            headerTitle: () => (
              <View style={{ width: 200, height: 40 }}>
                <Name width="100%" height="100%" />
              </View>
            ),
            headerBackTitleVisible: false,
            headerTitleAlign: 'left', // You may want to center the logo
            tabBarIcon: ({ focused }) => (
              <TabIcon Component={Home} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name='leaderboard'
          options={{
            title: 'Leaderboard',
            headerShown: false,
            headerTitle: 'Eco-Sankalp Now',
            headerBackTitleVisible: false,
            headerTitleAlign: '',
            tabBarIcon: ({ focused }) => (
              <TabIcon Component={Blogs} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name='devices'
          options={{
            title: 'Devices',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon Component={Devices} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name='institutions'
          options={{
            title: 'Institutions',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon Component={Organisations} focused={focused} />
            ),
          }}
        />
          <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon Component={Profile} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default _layout