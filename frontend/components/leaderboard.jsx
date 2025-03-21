import React, { useState, useEffect, useMemo } from 'react';
import { View, Alert, Image, Text, FlatList, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const LeaderboardScreen = () => {
  const [globalData] = useState([
    { name: 'Rajesh Sharma', score: null, iconUrl: '' },
    { name: 'Priya Patel', score: 12, iconUrl: 'https://randomuser.me/api/portraits/women/62.jpg' },
    { name: 'Vikram Singh', score: 244, iconUrl: 'https://randomuser.me/api/portraits/men/44.jpg' },
    { name: 'Ananya Gupta', score: 0, iconUrl: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { name: 'Arjun Malhotra', score: 20, iconUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Rahul Verma', score: 69, iconUrl: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Divya Krishnan', score: 101, iconUrl: 'https://randomuser.me/api/portraits/women/43.jpg' },
    { name: 'Sanjay Kapoor', score: 41, iconUrl: 'https://randomuser.me/api/portraits/men/57.jpg' },
    { name: 'Neha Reddy', score: 80, iconUrl: 'https://randomuser.me/api/portraits/women/25.jpg' },
    { name: 'Kiran Joshi', score: 22, iconUrl: 'https://randomuser.me/api/portraits/women/17.jpg' },
    { name: 'Ajay Mehta', score: null, iconUrl: '' },
    { name: 'Meera Iyer', score: 25, iconUrl: 'https://randomuser.me/api/portraits/women/33.jpg' },
    { name: 'Rohit Desai', score: 30, iconUrl: 'https://randomuser.me/api/portraits/men/72.jpg' },
  ]);

  const [friendData] = useState([
    { name: 'Rahul Verma', score: 69, iconUrl: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Divya Krishnan', score: 101, iconUrl: 'https://randomuser.me/api/portraits/women/43.jpg' },
    { name: 'Sanjay Kapoor', score: 41, iconUrl: 'https://randomuser.me/api/portraits/men/57.jpg' },
  ]);

  const [filter, setFilter] = useState(0);
  const [userRank, setUserRank] = useState(1);

  const user = {
    name: 'Rahul Verma',
    score: 69,
    iconUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
  };

  const processLeaderboardData = (data) =>
    data
      .map((item) => ({
        ...item,
        score: item.score ?? 0,
        iconUrl: item.iconUrl || DEFAULT_AVATAR,
      }))
      .sort((a, b) => b.score - a.score);

  const sortedGlobalData = useMemo(() => processLeaderboardData(globalData), [globalData]);
  const sortedFriendData = useMemo(() => processLeaderboardData(friendData), [friendData]);

  useEffect(() => {
    const rank = sortedGlobalData.findIndex((item) => item.name === user.name) + 1;
    setUserRank(rank);
  }, [sortedGlobalData]);

  const ordinalSuffix = (i) => {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) return i + 'st';
    if (j === 2 && k !== 12) return i + 'nd';
    if (j === 3 && k !== 13) return i + 'rd';
    return i + 'th';
  };

  const renderHeader = () => (
    <View
      style={{
        backgroundColor: '#609966',
        padding: 20,
        paddingTop: StatusBar.currentHeight + 20,
        alignItems: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
      }}
    >
      <Text style={{ fontSize: 32, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 15 }}>
        🏆 Leaderboard
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F1F5F9',
          padding: 20,
          borderRadius: 20,
          width: '95%',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          marginVertical: 20,
        }}
      >
        <Text style={{ fontSize: 22, color: '#334155', fontWeight: '700', flex: 1, textAlign: 'center' }}>
          {ordinalSuffix(userRank)}
        </Text>
        <Image
          style={{
            height: 80,
            width: 80,
            borderRadius: 40,
            marginHorizontal: 15,
            borderWidth: 3,
            borderColor: '#94A3B8',
          }}
          source={{ uri: user.iconUrl || DEFAULT_AVATAR }}
        />
        <Text style={{ fontSize: 22, color: '#334155', fontWeight: '700', flex: 1, textAlign: 'center' }}>
          {user.score} pts
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button
          mode={filter === 0 ? 'contained' : 'outlined'}
          onPress={() => setFilter(0)}
          style={{ marginHorizontal: 10, borderRadius: 25 }}
          labelStyle={{ fontWeight: '700', fontSize: 16 }}
          buttonColor={filter === 0 ? '#334155' : '#FFFFFF'}
          textColor={filter === 0 ? '#FFFFFF' : '#334155'}
        >
          Global
        </Button>
        <Button
          mode={filter === 1 ? 'contained' : 'outlined'}
          onPress={() => setFilter(1)}
          style={{ marginHorizontal: 10, borderRadius: 25 }}
          labelStyle={{ fontWeight: '700', fontSize: 16 }}
          buttonColor={filter === 1 ? '#334155' : '#FFFFFF'}
          textColor={filter === 1 ? '#FFFFFF' : '#334155'}
        >
          Friends
        </Button>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginVertical: 6,
        padding: 18,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        marginHorizontal: 15,
      }}
    >
      <Text style={{ fontSize: 18, width: 30, textAlign: 'center', color: '#64748B' }}>
        {index + 1}
      </Text>
      <Image
        source={{ uri: item.iconUrl }}
        style={{ width: 55, height: 55, borderRadius: 27.5, marginHorizontal: 15 }}
      />
      <Text style={{ flex: 1, fontSize: 18, color: '#1E293B', fontWeight: '600' }}>{item.name}</Text>
      <Text style={{ fontSize: 16, color: '#475569', fontWeight: '700' }}>{item.score} pts</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', width: '100%' }}>
      {renderHeader()}
      <FlatList
        data={filter === 0 ? sortedGlobalData : sortedFriendData}
        keyExtractor={(item, index) => item.name}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
    </View>
  );
};

export default LeaderboardScreen;