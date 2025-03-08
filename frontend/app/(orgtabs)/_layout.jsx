import { View, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect, Stack } from 'expo-router'
import Home from '../../assets/svg/home';
import Profile from '../../assets/svg/profile';

import '../../global.css'

const TabIcon = (icon, color, name, focused) => {
    return (
        <View>
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-12 h-12"
            />
        </View>
    )
}

const _layout = () => {
    return (
        <>
            <Tabs>
                <Tabs.Screen
                    name="homeOrg"
                    options={{
                        title: 'Home',
                        headerShown: true, // Show the header
                        headerTitle: 'AppName', // Remove the title
                        headerBackTitleVisible: false, // Hide the back button title
                        headerTitleAlign: '',
                        tabBarIcon: ({ color, focused, name }) => (
                            <Home></Home>
                        ),
                    }}
                />
    
                <Tabs.Screen
                    name='ordersOrg'
                    options={{
                        title: 'Orders',
                        headerShown: false,
                        tabBarIcon: ({ color, focused, name }) => (
                            <Profile></Profile>
                        ),
                    }}
                />

                <Tabs.Screen
                    name='profileOrg'
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused, name }) => (
                            <Profile></Profile>
                        ),
                    }}
                />

            </Tabs>
        </>
    )
}

export default _layout

