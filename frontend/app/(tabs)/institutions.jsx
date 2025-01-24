import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';

const GOOGLE_MAPS_API_KEY = "AIzaSyB_KkJwx0da8l-clsHMXvYP4m4cV1ij3_E";

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location access is required");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error fetching current location:", error);
        Alert.alert("Error", "Unable to fetch location.");
      }
    };

    fetchCurrentLocation();
  }, []);

  const fetchNearbyInstitutions = async () => {
    if (!currentLocation) {
      Alert.alert("Location Not Available", "Please enable location services");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        "https://cloudrunservice-254131401451.us-central1.run.app/user/orgLocations",
        {
          params: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            radius: 50, // 50 km radius
          },
        }
      );

      setInstitutions(response.data.locations || []);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      Alert.alert("Error", "Could not fetch nearby institutions");
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = async (destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`,
        {
          params: {
            origins: `${currentLocation.latitude},${currentLocation.longitude}`,
            destinations: `${destination.latitude},${destination.longitude}`,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (
        response.data &&
        response.data.rows &&
        response.data.rows[0] &&
        response.data.rows[0].elements &&
        response.data.rows[0].elements[0]
      ) {
        const distanceText = response.data.rows[0].elements[0].distance.text;
        const durationText = response.data.rows[0].elements[0].duration.text;
        setDistance(distanceText);
        setDuration(durationText);
      } else {
        throw new Error("Unexpected response structure from Distance Matrix API");
      }
    } catch (error) {
      console.error("Error calculating distance:", error.message);
      Alert.alert("Error", "Could not calculate distance");
    }
  };

  const handleGetDirections = () => {
    if (!currentLocation || !selectedInstitution) {
      Alert.alert("Error", "Current location or destination is missing");
      return;
    }
  
    setShowRoute(true);
    
    // Keep the selected institution for drawing directions
    // setSelectedInstitution(null); // Remove this line
  
    // Zoom in and center on current location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  };
  // In the top bar section
  <TouchableOpacity
    onPress={() => {
      setShowRoute(false);
      setSelectedInstitution(null);
      setDistance(null);
      setDuration(null);
    }}
    className="p-2"
  >
    <Icon name="arrow-back" size={24} color="#007bff" />
  </TouchableOpacity>

  return (
    <View className="flex-1">
      {currentLocation ? (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
        >
          <Circle
            center={currentLocation}
            radius={100}
            fillColor="rgba(0, 0, 255, 0.2)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />

          {institutions.slice(0, 10).map((institution, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: institution.latitude,
                longitude: institution.longitude,
              }}
              title={institution.name}
              onPress={() => {
                setSelectedInstitution(institution);
                calculateDistance(institution);
              }}
            />
          ))}

          {showRoute && selectedInstitution && (
            <MapViewDirections
              origin={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              destination={{
                latitude: selectedInstitution.latitude,
                longitude: selectedInstitution.longitude,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="blue"
              onStart={() => console.log("Fetching directions...")}
              onReady={(result) => {
                console.log("Directions fetched successfully:", result);
                setDistance(`${result.distance.toFixed(2)} km`);
                setDuration(`${Math.ceil(result.duration)} mins`);
              }}
              onError={(error) => console.error("Directions API Error:", error)}
            />
          )}
        </MapView>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading map...</Text>
        </View>
      )}

      {/* Directions Info Bar */}
      {showRoute && (
        <View className="absolute top-0 left-0 right-0 bg-white flex-row items-center justify-between p-3 shadow-md">
          <TouchableOpacity
            onPress={() => setShowRoute(false)}
            className="p-2"
          >
            <Icon name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-base font-bold mr-2">
              {distance} | {duration}
            </Text>
          </View>

          {/* Placeholder for additional actions */}
          <View className="w-8" />
        </View>
      )}

      {/* Nearby Institutions Button */}
      {!showRoute && (
        <TouchableOpacity
          onPress={fetchNearbyInstitutions}
          className="absolute bottom-5 self-center bg-blue-500 p-3 rounded-lg"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-bold">
              Find Nearby Institutions
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Institution Selection Modal */}
      <Modal
        visible={!!selectedInstitution && !showRoute}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-5 rounded-t-2xl">
            {selectedInstitution && (
              <>
                <Text className="text-lg font-bold">
                  {selectedInstitution.name}
                </Text>
                {distance && (
                  <Text className="mt-2">Distance: {distance}</Text>
                )}
                <View className="flex-row mt-4 justify-between">
                  <TouchableOpacity
                    onPress={() => setSelectedInstitution(null)}
                    className="flex-1 mr-2 bg-red-500 p-3 rounded-lg"
                  >
                    <Text className="text-white text-center">Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleGetDirections}
                    className="flex-1 ml-2 bg-blue-500 p-3 rounded-lg"
                  >
                    <Text className="text-white text-center">
                      Get Directions
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Institutions;