import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

function Maps() {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required to use the map.');
          setLoading(false);
          return;
        }

        let lastKnownLocation = await Location.getLastKnownPositionAsync();
        if (lastKnownLocation) {
          setLocation(lastKnownLocation);
          setMapRegion({
            latitude: lastKnownLocation.coords.latitude,
            longitude: lastKnownLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } else {
          let currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 10000,
          });
          setLocation(currentLocation);
          setMapRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch location. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading map... Fetching your current location.</Text>
        </View>
      </View>
    );
  }

  if (!mapRegion) {
    return (
      <View style={styles.container}>
        <Text>Unable to fetch location. Please enable location services.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion}
      >
        {mapRegion && (
          <Marker
            title="Your Location"
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
          />
        )}
      </MapView>
    </View>
  );
}

export default Maps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
