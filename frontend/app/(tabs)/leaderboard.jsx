import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import Home from '../../assets/svg/home';
import '../../global.css';
import LeaderboardScreen from '../../components/leaderboard';
import { Icon } from 'react-native-paper';
import ChatBotButton from '../../components/chatbotbutton';
const Leaderboard = () => {
  return (
    <View className="w-full h-full items-center">
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      <LeaderboardScreen />
      <ChatBotButton/>
    </View>
  );
};

export default Leaderboard;
