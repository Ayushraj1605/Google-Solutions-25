import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { router } from 'expo-router';
import Cards from '../../components/devicecards';
import SearchBar from '../../components/searchbar';
import ChatBotButton from '../../components/chatbotbutton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Devices = ({ visible = true, style }) => {
  const [isExtended, setIsExtended] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  // In your parent component that renders DeviceCard
  const [devices, setDevices] = useState([]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Increment refreshKey to trigger a data reload
    setRefreshKey(prevKey => prevKey + 1);
    // You can end the refreshing animation after a delay or when data loads
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('ID');
      if (value !== null) {
        setUserId(value);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://cloudrunservice-254131401451.us-central1.run.app/user/getDevices?userId=${userId}&cache=${refreshKey}`
          );
          if (response.data?.devices) {
            const devicesWithStatus = response.data.devices.map(device => ({
              ...device,
              status: device.status || "",
              deviceId: device.deviceId || device.deviceID,
              deviceID: device.deviceId || device.deviceID
            }));

            console.log('Fetched devices data:', devicesWithStatus);
            setData(devicesWithStatus);
            setFilteredData(devicesWithStatus);
          }
        } catch (error) {
          console.error('Error fetching devices:', error);
        } finally {
          // Ensure refreshing is set to false after data is fetched
          setRefreshing(false);
        }
      };
      fetchData();
    }
  }, [userId, refreshKey]);

  useEffect(() => {
    const filterData = () => {
      if (searchQuery) {
        const filtered = data.filter(item => {
          const text = `${item.deviceName || ''} ${item.deviceId || item.deviceID || ''} ${item.deviceType || ''}`.toLowerCase();
          return text.includes(searchQuery.toLowerCase());
        });
        setFilteredData(filtered);
      } else if (data.length > 0) {
        setFilteredData(data);
      }
    };
    filterData();
  }, [searchQuery, data]);

  const onScroll = ({ nativeEvent }) => {
    setIsExtended(nativeEvent?.contentOffset?.y <= 0);
  };

  const handlePress = () => {
    router.push('/deviceinfo');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const debouncedSearch = React.useCallback(
    (query) => {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 500);

      return () => clearTimeout(timeoutId);
    },
    []
  );
  const handleStatusUpdate = (deviceId, newStatus) => {
    setData(prevDevices =>
      prevDevices.map(device =>
        (device.deviceId === deviceId || device.deviceID === deviceId)
          ? { ...device, status: newStatus }
          : device
      )
    );

    // Also update filteredData to keep them in sync
    setFilteredData(prevDevices =>
      prevDevices.map(device =>
        (device.deviceId === deviceId || device.deviceID === deviceId)
          ? { ...device, status: newStatus }
          : device
      )
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      <SearchBar onSearch={debouncedSearch} />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#609966" />
        </View>
      ) : (
        <ScrollView
          onScroll={onScroll}
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#609966']}
              tintColor="#609966"
            />
          }
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <Cards
                key={item.id || index}
                data={item}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No devices found</Text>
            </View>
          )}
        </ScrollView>
      )}
      <AnimatedFAB
        icon="plus"
        label=" Add Device"
        extended={isExtended}
        onPress={handlePress}
        visible={visible}
        animateFrom="left"
        iconMode="static"
        color="white"
        uppercaseLabel={false}
        labelStyle={{ color: '#FFFFFF', fontWeight: '600' }}
        style={[styles.fabStyle, style]}
      />
      <ChatBotButton />
    </View>
  );
};

export default Devices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 12,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 20,
    gap: 16,
  },
  fabStyle: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: '#609966',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});