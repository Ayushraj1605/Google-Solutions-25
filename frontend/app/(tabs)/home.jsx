import { View, Text } from 'react-native'
import React from 'react'
import '../../global.css'
import Segments from '../../components/segments'

const home = () => {
  return (
    <View className="flex-1 items-center">
      <Segments />
    </View>
  )
}

export default home