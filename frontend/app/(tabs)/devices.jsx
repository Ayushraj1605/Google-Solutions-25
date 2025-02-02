import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import '../../global.css'
import Cards from '../../components/devicecards'
import SearchBar from '../../components/searchbar'

const devices = () => {
  return (
    <View className="w-full h-full items-center bg-white">
      <SearchBar />
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} className="flex w-full h-full">
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
      </ScrollView>
      
    </View>
  )
}

export default devices

