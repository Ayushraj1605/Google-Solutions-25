import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import '../../global.css'
import Segments from '../../components/segments'

const Home = () => {
  return (
    <View className="items-center">
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      <Segments />
    </View>
  )
}

export default Home
