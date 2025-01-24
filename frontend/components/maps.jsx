import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Alert, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

function Maps({
  containerStyle,
  onLocationSelect,
  initialRegion
}) {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(initialRegion || null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required');
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 10000,
        });

        const region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setLocation(currentLocation);
        setMapRegion(region);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch location');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  const handleCurrentLocationMark = () => {
    if (location) {
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setMarkerCoordinate(currentLocation);
      onLocationSelect(currentLocation);
    }
  };

  const handleMarkerDragEnd = (e) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setMarkerCoordinate(newCoordinate);
    onLocationSelect(newCoordinate);
  };

  const handleMapPress = (e) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setMarkerCoordinate(newCoordinate);
    onLocationSelect(newCoordinate);
  };

  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}
        onPress={handleMapPress}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            draggable
            onDragEnd={handleMarkerDragEnd}
            title="Drag to adjust location"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCurrentLocationMark}
        >
          <Text style={styles.buttonText}>Mark My Location</Text>
        </TouchableOpacity>
        {markerCoordinate && (
          <TouchableOpacity
            style={[styles.button, styles.unmarkButton]}
            onPress={() => {
              setMarkerCoordinate(null);
              onLocationSelect(null);
            }}
          >
            <Text style={styles.buttonText}>Unmark Location</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  unmarkButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default Maps;