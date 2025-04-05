import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import '../../global.css'
import ChatbotScreen from '../../components/chatbotbutton'
const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='deviceinfo'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name='organisationList'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      /><Stack.Screen
        name='addresses'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name='recycleform'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name='userAnalytics'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name='chatbot'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name='blogediting'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name='orderHistory'
        options={{
          headerShown: true,
          headerTitle: 'My Recycling Orders',
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name='blogsBookmarks'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name="myAddresses"
        options={{
          headerShown: false, // We're using our custom header
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>

  )
}

export default _layout

const styles = StyleSheet.create({})