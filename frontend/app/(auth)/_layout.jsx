import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import '../../global.css'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='signIn'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='forgotpassword'
        options={{
          headerShown: true, // Show the header
          headerTitle: 'Forgot Password', // Remove the title
          headerBackTitleVisible: false, // Hide the back button title
          headerTitleAlign: 'center', 
        }}
      />

      <Stack.Screen
        name='signUp'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signUpOrg"
        options={{
          headerShown: true, // Show the header
          headerTitle: '', // Remove the title
          headerBackTitleVisible: false, // Hide the back button title
        }}
      />
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})