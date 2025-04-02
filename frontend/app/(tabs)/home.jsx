import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import '../../global.css'
import Segments from '../../components/segments'
import { TouchableOpacity } from 'react-native'
import ChatBotButton from '../../components/chatbotbutton'
import BlogEditButton from '../../components/blogeditbutton'
const Home = () => {
  return (
    <View className="items-center" style={{display:'flex',flexDirection:'column'}}>
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      <Segments />
      <BlogEditButton></BlogEditButton>
    </View>
  )
}

export default Home
