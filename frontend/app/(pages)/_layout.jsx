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
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
      <Stack.Screen
        name='blogsBookmarks'
        options={{
          headerShown: false,
          // headerTitle: 'Upload Device Info',
        }}
      />
    </Stack>
    
  )
}

export default _layout

const styles = StyleSheet.create({})