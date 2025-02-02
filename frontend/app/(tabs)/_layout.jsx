import { Text, View, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect, Stack } from 'expo-router'
import Home from '../../assets/svg/home';
import Blogs from '../../assets/svg/blogs';
import icons from '../../constants';
import Organisations from '../../assets/svg/organisations';
import Devices from '../../assets/svg/devices';
import Profile from '../../assets/svg/profile';
import '../../global.css'

const TabIcon = (icon, color, name, focused) => {
    return (
        <View>
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-6 h-6"
            />
        </View>
    )
}

const _layout = () => {
    return (
        <>
            <Tabs>
                <Tabs.Screen
                    name="home"
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
                    name='blogs'
                    options={{
                        title: 'Blogs',
                        headerShown: true, // Show the header
                        headerTitle: 'AppName', // Remove the title
                        headerBackTitleVisible: false, // Hide the back button title
                        headerTitleAlign: '',
                        tabBarIcon: ({ color, focused, name }) => (
                            <Blogs></Blogs>
                        ),
                    }}
                    
                />

                <Tabs.Screen
                    name='devices'
                    options={{
                        title: 'Devices',
                        headerShown: false,
                        tabBarIcon: ({ color, focused, name }) => (
                            <Devices></Devices>
                        ),
                    }}
                    
                />

                <Tabs.Screen
                    name='institutions'
                    options={{
                        title: 'Institutions',
                        headerShown: false,
                        tabBarIcon: ({ color, focused, name }) => (
                            <Organisations></Organisations>
                        ),
                    }}

                />

                <Tabs.Screen
                    name='profile'
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

