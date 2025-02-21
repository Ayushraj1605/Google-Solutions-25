import React, { useState, useEffect } from 'react';
import { View, Alert, Image, Text } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import Leaderboard from 'react-native-leaderboard';

const LeaderboardScreen = () => {
    const [globalData, setGlobalData] = useState([
        { name: 'We Tu Lo', score: null, iconUrl: 'https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg' },
        { name: 'Adam Savage', score: 12, iconUrl: 'https://www.shareicon.net/data/128x128/2016/09/15/829473_man_512x512.png' },
        { name: 'Derek Black', score: 244, iconUrl: 'http://ttsbilisim.com/wp-content/uploads/2014/09/20120807.png' },
        { name: 'Erika White', score: 0, iconUrl: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-eskimo-girl.png' },
        { name: 'Jimmy John', score: 20, iconUrl: 'https://static.witei.com/static/img/profile_pics/avatar4.png' },
        { name: 'Joe Roddy', score: 69, iconUrl: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-braindead-zombie.png' },
        { name: 'Ericka Johannesburg', score: 101, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPis8NLdplTV1AJx40z-KS8zdgaSPaCfNINLtQ-ENdPvrtMWz' },
        { name: 'Tim Thomas', score: 41, iconUrl: 'http://conserveindia.org/wp-content/uploads/2017/07/teamMember4.png' },
        { name: 'John Davis', score: 80, iconUrl: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-afro-guy.png' },
        { name: 'Tina Turner', score: 22, iconUrl: 'https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png' },
        { name: 'Harry Reynolds', score: null, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsSlzi6GEickw2Ft62IdJTfXWsDFrOIbwXhzddXXt4FvsbNGhp' },
        { name: 'Betty Davis', score: 25, iconUrl: 'https://landofblogging.files.wordpress.com/2014/01/bitstripavatarprofilepic.jpeg?w=300&h=300' },
        { name: 'Lauren Leonard', score: 30, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr27ZFBaclzKcxg2FgJh6xi3Z5-9vP_U1DPcB149bYXxlPKqv-' },
    ]);

    const [friendData, setFriendData] = useState([
        { name: 'Joe Roddy', score: 69, iconUrl: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-braindead-zombie.png' },
        { name: 'Ericka Johannesburg', score: 101, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPis8NLdplTV1AJx40z-KS8zdgaSPaCfNINLtQ-ENdPvrtMWz' },
        { name: 'Tim Thomas', score: 41, iconUrl: 'http://conserveindia.org/wp-content/uploads/2017/07/teamMember4.png' },
    ]);

    const [filter, setFilter] = useState(0);
    const [userRank, setUserRank] = useState(1);
    const user = { name: 'Joe Roddy', score: 69, iconUrl: 'https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg'};

    const alert = (title, body) => {
        Alert.alert(title, body, [{ text: 'OK', onPress: () => { } }], { cancelable: false });
    };

    const sortLeaderboard = (data) => {
        if (!data) return [];
        return data.sort((a, b) => (b.score || 0) - (a.score || 0));
    };

    useEffect(() => {
        const sortedData = sortLeaderboard([...globalData]);
        const rank = sortedData.findIndex((item) => item.name === user.name) + 1;
        setUserRank(rank);
    }, [globalData]);

    const renderHeader = () => {
        return (
            <View style={{ backgroundColor: '#609966', padding: 15, paddingTop: 35, alignItems: 'center' }}>
                <Text style={{ fontSize: 25, color: 'gold' }}>Leaderboard </Text>
                <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    marginBottom: 15, marginTop: 20
                }}>
                    <Text style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 40 }}>
                        {ordinalSuffix(userRank)}
                    </Text>
                    <Image style={{ flex: 0.66, height: 60, width: 60, borderRadius: 30 }}
                        source={{ uri: user.iconUrl }} />
                    <Text style={{ color: 'white', fontSize: 25, flex: 1, marginLeft: 40 }}>
                        {user.score} pts
                    </Text>
                </View>
                <ButtonGroup
                    onPress={(index) => setFilter(index)}
                    selectedIndex={filter}
                    buttons={['Global', 'Friends']}
                    containerStyle={{ height: 35 }} 
                />
            </View>
        );
    };

    const leaderboardProps = {
        labelBy: 'name',
        sortBy: 'score',
        data: filter === 0 ? globalData : friendData,
        icon: 'iconUrl',
        onRowPress: (item, index) => alert(`${item.name} clicked`, `${item.score} points, wow!`),
        sort: sortLeaderboard
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {renderHeader()}
            <Leaderboard {...leaderboardProps} />
        </View>
    );
};

const ordinalSuffix = (i) => {
    const j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
};

export default LeaderboardScreen;