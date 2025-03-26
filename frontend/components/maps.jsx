import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

function Maps({
  containerStyle,
  onLocationSelect,
  initialLocation,
  mapStyle
}) {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Animation for location button
  const locationButtonScale = useRef(new Animated.Value(1)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    // If initial location is provided, set it as the marker
    if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
      const coords = {
        latitude: parseFloat(initialLocation.latitude),
        longitude: parseFloat(initialLocation.longitude),
      };
      
      setMarkerCoordinate(coords);
      setMapRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }

    async function getCurrentLocation() {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Location permission denied');
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 15000,
        });

        const region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(currentLocation);
        
        // Only set map region if not already set by initialLocation
        if (!mapRegion) {
          setMapRegion(region);
        }
      } catch (error) {
        console.error('Location error:', error);
        setErrorMsg('Unable to fetch location. Please check your location settings.');
      } finally {
        setLoading(false);
      }
    }

    getCurrentLocation();
  }, [initialLocation]);

  const handleCurrentLocationMark = () => {
    if (!location) return;
    
    // Animate button press
    Animated.sequence([
      Animated.timing(locationButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(locationButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    const currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    
    // Animate map to current location
    mapRef.current?.animateToRegion({
      ...currentLocation,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 500);
    
    setMarkerCoordinate(currentLocation);
    onLocationSelect(currentLocation);
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
      <View style={[styles.container, containerStyle, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, containerStyle, styles.errorContainer]}>
        <MaterialIcons name="location-off" size={32} color="#DC2626" />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            getCurrentLocation();
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        onPress={handleMapPress}
        customMapStyle={mapStyle}
        rotateEnabled={true}
        zoomEnabled={true}
        moveOnMarkerPress={false}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            draggable
            onDragEnd={handleMarkerDragEnd}
            title="Selected Location"
            description="Drag to adjust precisely"
            pinColor="#4F46E5"
          />
        )}
      </MapView>
      
      {/* Location button */}
      <Animated.View 
        style={[
          styles.locationButtonContainer,
          { transform: [{ scale: locationButtonScale }] }
        ]}
      >
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleCurrentLocationMark}
          activeOpacity={0.7}
        >
          <Ionicons name="locate" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Helper text */}
      <View style={styles.helperTextContainer}>
        <Text style={styles.helperText}>
          {markerCoordinate 
            ? "Drag the marker to adjust location precisely" 
            : "Tap on the map to select your location"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationButtonContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 999,
  },
  locationButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helperTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    zIndex: 999,
  },
  helperText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  }
});

export default Maps;