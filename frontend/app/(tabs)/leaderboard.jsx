import { View, Text } from 'react-native';
import React from 'react';
import Home from '../../assets/svg/home';
import '../../global.css';
import LeaderboardScreen from '../../components/leaderboard';

const Leaderboard = () => {
  return (
    <View className="w-full h-full items-center bg-red-500">
      <LeaderboardScreen />
    </View>
  );
};

export default Leaderboard;
