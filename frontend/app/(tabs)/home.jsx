import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import '../../global.css'
import Segments from '../../components/segments'
import { TouchableOpacity } from 'react-native'
import ChatBotButton from '../../components/chatbotbutton'
// import { red100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors'
const Home = () => {
  return (
    <View className="items-center">
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      <Segments />
      {/* <View style={{
        height:30,
        width:30,
        backgroundColor:'red',
      }}>
        <Text>AbS</Text>
        <ChatBotButton/>
      </View> */}
    </View>
  )
}

export default Home
