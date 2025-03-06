import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import Cards from '../../components/devicecards';
import SearchBar from '../../components/searchbar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Devices = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
}) => {
  const navigation = useNavigation();
  const [isExtended, setIsExtended] = useState(true);
  const isIOS = Platform.OS === 'ios';
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);


  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('ID'); // Retrieve token saved during SignIn
      if (value !== null) {
        console.log('Retrieved ID:', value); // Log the retrieved value
        setUserId(value); // Set token in state
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    } finally {
      setIsLoading(false); // Hide loader after retrieval
    }
  };

  useEffect(() => {
    // Define an async function to fetch data
    _retrieveData();
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://cloudrunservice-254131401451.us-central1.run.app/user/getDevices?userId=${userId}`);
        if (response.data && response.data.devices) {
          const jsonData = response.data.devices;
          // console.log(response.data.devices);
          setData(jsonData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  },[userId]);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  const handlePress = () => {
    // router.push('/deviceinfo');
  };

  return (
    <View style={styles.container}>
      <SearchBar />
      <ScrollView
        onScroll={onScroll}
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
      >
        {data.length > 0 ? (
          data.map((item, i) => (
            // Pass the item data to the Cards component.
            console.log(item),
            <Cards key={item.id ? item.id : i} data={item} />
          ))
        ) : (
          // Optionally, render something else when there's no data.
          <View></View>
        )}
      </ScrollView>
      <AnimatedFAB
        icon={'plus'}
        label={'  Add Device'}
        extended={isExtended}
        onPress={handlePress}
        visible={visible}
        animateFrom={'left'}
        iconMode={'static'}
        color="white"
        uppercaseLabel={false}
        labelStyle={{ color: '#FFFFFF' }}
        style={[styles.fabStyle, style, fabStyle]}
      />
    </View>
  );
};

export default Devices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  fabStyle: {
    bottom: 16,
    left: 16,
    position: 'absolute',
    backgroundColor: "#609966",
  },
});
