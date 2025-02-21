import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import '../../global.css'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='deviceinfo'
        options={{
          // headerShown: false,
          headerTitle: 'Upload Device Info',
        }}
      />
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})