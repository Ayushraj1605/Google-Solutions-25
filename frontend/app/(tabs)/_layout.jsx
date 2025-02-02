import { View, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect, Stack } from 'expo-router'
import { icons } from '../../constants';
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
                    name="home"
                    options={{
                        title: 'Home',
                        headerShown: true, // Show the header
                        headerTitle: 'AppName', // Remove the title
                        headerBackTitleVisible: false, // Hide the back button title
                        headerTitleAlign: '',
                        tabBarIcon: ({ color, focused, name }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Home"
                                focused={focused}
                            />
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
                    }}

                />

                <Tabs.Screen
                    name='devices'
                    options={{
                        title: 'Devices',
                        headerShown: false,
                    }}

                />

                <Tabs.Screen
                    name='institutions'
                    options={{
                        title: 'Institutions',
                        headerShown: false,
                    }}

                />

                <Tabs.Screen
                    name='profile'
                    options={{
                        title: 'Profile',
                        headerShown: false,
                    }}

                />


            </Tabs>
        </>
    )
}

export default _layout

