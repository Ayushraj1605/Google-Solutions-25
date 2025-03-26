import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator, 
  Alert, 
  FlatList, 
  Animated, 
  Dimensions, 
  Image, 
  StyleSheet, 
  StatusBar,
  Platform 
} from "react-native";
import MapView, { Marker, Circle, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from "expo-location";
import axios from "axios";
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = "AIzaSyB_KkJwx0da8l-clsHMXvYP4m4cV1ij3_E";

// Custom map style - more modern looking map
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  }
];

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [sortedInstitutions, setSortedInstitutions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const mapRef = useRef(null);
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const cancelTokenSource = useRef(null);

  // Cancellable API request utility
  const createCancellableRequest = () => {
    cancelTokenSource.current = axios.CancelToken.source();
    return cancelTokenSource.current;
  };

  // Cleanup function to cancel ongoing requests
  useEffect(() => {
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Component unmounted');
      }
    };
  }, []);

  // Fetch current location
  const fetchCurrentLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return null;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'android' 
          ? Location.Accuracy.Low 
          : Location.Accuracy.Balanced,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Location fetch error:", error);
      setLocationError("Unable to fetch location");
      return null;
    }
  }, []);

  // Fetch nearby institutions
  const fetchNearbyInstitutions = async (location = currentLocation) => {
    if (!location) {
      Alert.alert("Location Not Available", "Please enable location services");
      return;
    }

    setLoading(true);

    try {
      const cancelToken = createCancellableRequest();
      const response = await axios.get(
        "https://cloudrunservice-254131401451.us-central1.run.app/user/orgLocations",
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: 50, // 50 km radius
          },
          cancelToken: cancelToken.token
        }
      );

      setInstitutions(response.data.locations || []);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching institutions:", error);
        Alert.alert("Error", "Could not fetch nearby institutions");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial location and institutions fetch
  useEffect(() => {
    const initializeLocation = async () => {
      const location = await fetchCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setIsFirstLoad(false);
        fetchNearbyInstitutions(location);
      }
    };

    if (isFirstLoad) {
      initializeLocation();
    }
  }, [isFirstLoad]);

  // Sort institutions by distance
  const sortInstitutionsByDistance = useCallback(async () => {
    if (!currentLocation || institutions.length === 0) return;

    try {
      const cancelToken = createCancellableRequest();
      const promises = institutions.map(async (institution) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/distancematrix/json`,
            {
              params: {
                origins: `${currentLocation.latitude},${currentLocation.longitude}`,
                destinations: `${institution.latitude},${institution.longitude}`,
                key: GOOGLE_MAPS_API_KEY,
              },
              cancelToken: cancelToken.token
            }
          );

          const element = response.data.rows[0]?.elements[0];
          if (element && element.status === 'OK') {
            return {
              ...institution,
              distanceText: element.distance.text,
              distanceValue: element.distance.value,
            };
          }
          return institution;
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error("Distance calculation error:", error);
          }
          return institution;
        }
      });

      const institutionsWithDistance = await Promise.all(promises);
      const sorted = institutionsWithDistance
        .filter(inst => inst.distanceValue !== undefined)
        .sort((a, b) => a.distanceValue - b.distanceValue);
      
      setSortedInstitutions(sorted);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Sorting institutions error:", error);
      }
    }
  }, [currentLocation, institutions]);

  // Trigger sorting when institutions or location changes
  useEffect(() => {
    if (institutions.length > 0 && currentLocation) {
      sortInstitutionsByDistance();
    }
  }, [institutions, currentLocation, sortInstitutionsByDistance]);

  // Calculate distance to selected institution
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

  // Fetch route directions
  const fetchDirections = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${origin.latitude},${origin.longitude}`,
            destination: `${destination.latitude},${destination.longitude}`,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.status === "OK") {
        const route = response.data.routes[0];
        const leg = route.legs[0];
        
        // Update distance and duration
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
        
        // Decode the polyline
        const points = route.overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        
        setRouteCoordinates(decodedPoints);
        
        // Fit the map to show the route
        if (mapRef.current && decodedPoints.length > 0) {
          const padding = { top: 100, right: 50, bottom: 50, left: 50 };
          mapRef.current.fitToCoordinates(decodedPoints, { edgePadding: padding, animated: true });
        }
      } else {
        throw new Error(`Directions API error: ${response.data.status}`);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      Alert.alert("Error", "Could not fetch directions");
    }
  };

  // Google Polyline decoder function
  const decodePolyline = (encoded) => {
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;
    const coordinates = [];

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      const latitude = lat / 1e5;
      const longitude = lng / 1e5;

      coordinates.push({
        latitude,
        longitude,
      });
    }

    return coordinates;
  };

  // Handle get directions
  const handleGetDirections = () => {
    if (!currentLocation || !selectedInstitution) {
      Alert.alert("Error", "Current location or destination is missing");
      return;
    }
  
    setShowRoute(true);
    setSelectedInstitution(null);
    setDrawerOpen(false);
    
    // Fetch directions
    fetchDirections(currentLocation, selectedInstitution);
    
    // Initial zoom to current location before the route is fetched
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  };

  // Select institution from drawer
  const selectInstitutionFromDrawer = (institution) => {
    setSelectedInstitution(institution);
    calculateDistance(institution);
    
    // Close drawer
    setDrawerOpen(false);
    
    // Animate to the selected institution
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: institution.latitude,
        longitude: institution.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  };

  // Drawer animation
  useEffect(() => {
    Animated.spring(drawerAnimation, {
      toValue: drawerOpen ? 1 : 0,
      friction: 10,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [drawerOpen]);

  // Drawer transform for sliding effect
  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  // Location error handling
  const handleLocationError = () => {
    Alert.alert(
      "Location Error", 
      locationError || "Unable to access location services",
      [
        { 
          text: "Open Settings", 
          onPress: () => Location.openSettings() 
        },
        { 
          text: "Retry", 
          onPress: () => {
            setLocationError(null);
            setIsFirstLoad(true);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent={false}
        backgroundColor="#609966"
        barStyle="light-content" 
      />
      
      {locationError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={60} color="#FF6347" />
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity 
            style={styles.errorButton} 
            onPress={handleLocationError}
          >
            <Text style={styles.errorButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : currentLocation ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={true}
        >
          <Circle
            center={currentLocation}
            radius={100}
            fillColor="rgba(33, 150, 243, 0.15)"
            strokeColor="rgba(33, 150, 243, 0.5)"
            strokeWidth={1}
          />

          {institutions.map((institution, index) => (
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
            >
              <View style={styles.markerContainer}>
                <FontAwesome5 name="building" size={18} color="#609966" />
              </View>
            </Marker>
          ))}

          {showRoute && routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="#2196F3"
              lineDashPattern={[0]}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#609966" />
          <Text style={styles.loadingText}>Loading map... </Text>
        </View>
      )}

      {/* Header Bar - Only show when not in routing mode */}
      {!showRoute && (
        <View style={styles.header}>
          <View style={[styles.headerContent, { paddingTop: insets.top }]}>
            <Text style={styles.headerTitle}>E-cycle Institutions</Text>
            
            <TouchableOpacity 
              style={styles.drawerButton}
              onPress={() => setDrawerOpen(true)}
            >
              <MaterialIcons name="menu" size={28} color="#609966" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* My Location Button */}
      <TouchableOpacity 
        style={styles.myLocationButton}
        onPress={() => {
          if (mapRef.current && currentLocation) {
            mapRef.current.animateToRegion({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          }
        }}
      >
        <Ionicons name="locate" size={22} color="#609966" />
      </TouchableOpacity>

      {/* Directions Info Bar - Only show when in routing mode */}
      {showRoute && (
        <View style={styles.directionsBar}>
          <View style={[styles.directionsBarContent, { paddingTop: insets.top }]}>
            <TouchableOpacity
              onPress={() => {
                setShowRoute(false);
                setRouteCoordinates([]);
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#609966" />
            </TouchableOpacity>

            <View style={styles.directionsInfo}>
              <Text style={styles.directionsTitle}>Directions</Text>
              <Text style={styles.directionsText}>{`${distance} • ${duration}`}</Text>
            </View>

            <TouchableOpacity style={styles.directionsShare}>
              <Ionicons name="share-outline" size={24} color="#609966" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Refresh Button (only when not showing route) */}
      {!showRoute && (
        <TouchableOpacity
          onPress={() => fetchNearbyInstitutions()}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Institution Selection Modal */}
      <Modal
        visible={!!selectedInstitution && !showRoute}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedInstitution(null)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} style={styles.blurBackground} tint="dark" />
          <View style={styles.modalContent}>
            {selectedInstitution && (
              <>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>{selectedInstitution.name}</Text>
                
                <View style={styles.modalInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="location" size={20} color="#609966" />
                    <Text style={styles.infoText}>
                      {distance || "Calculating..."}
                    </Text>
                  </View>
                  
                  {duration && (
                    <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={20} color="#609966" />
                      <Text style={styles.infoText}>{duration}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setSelectedInstitution(null)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleGetDirections}
                    style={styles.directionsButton}
                  >
                    <Text style={styles.directionsButtonText}>
                      Get Directions
                    </Text>
                    <Ionicons name="navigate" size={18} color="white" style={{marginLeft: 5}} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Institutions Drawer */}
      <Animated.View 
        style={[
          styles.drawer,
          { transform: [{ translateX: drawerTranslateX }] }
        ]}
      >
        <View style={styles.drawerHeader}>
          <View style={[styles.drawerHeaderContent, { paddingTop: insets.top }]}>
            <Text style={styles.drawerTitle}>Nearby Institutions</Text>
            <TouchableOpacity 
              onPress={() => setDrawerOpen(false)}
              style={styles.drawerCloseButton}
            >
              <Ionicons name="close" size={24} color="#609966" />
            </TouchableOpacity>
          </View>
        </View>
        
        {sortedInstitutions.length > 0 ? (
          <FlatList
            data={sortedInstitutions}
            keyExtractor={(item, index) => `institution-${index}`}
            contentContainerStyle={styles.drawerList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.drawerItem}
                onPress={() => selectInstitutionFromDrawer(item)}
              >
                <View style={styles.drawerItemIcon}>
                  <FontAwesome5 name="building" size={20} color="#609966" />
                </View>
                <View style={styles.drawerItemContent}>
                  <Text style={styles.drawerItemTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.drawerItemDistance}>
                    {item.distanceText || "Distance unavailable"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyDrawer}>
            {loading ? (
              <ActivityIndicator size="large" color="#609966" />
            ) : (
              <>
                <Ionicons name="location-outline" size={60} color="#CCCCCC" />
                <Text style={styles.emptyDrawerText}>No institutions found nearby</Text>
                <TouchableOpacity 
                  style={styles.emptyDrawerButton}
                  onPress={() => fetchNearbyInstitutions()}
                >
                  <Text style={styles.emptyDrawerButtonText}>Refresh</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    // backgroundColor:'red',
    // paddingTop: 100,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f7f7f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555555',
  },
  header: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingTop: 10,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 130,
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  refreshButton: {
    position: 'absolute',
    right: 16,
    bottom: 70,
    backgroundColor: '#609966',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  directionsBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10, // Ensure this is above other elements
  },
  directionsBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    // paddingTop: 12,
    marginTop: 12,
    // backgroundColor: 'red',
  },
  backButton: {
    padding: 8,
  },
  directionsInfo: {
    flex: 1,
    alignItems: 'center',
  },
  directionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  directionsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  directionsShare: {
    padding: 8,
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: '#609966',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  modalInfo: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#555555',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555555',
    fontWeight: '600',
    fontSize: 16,
  },
  directionsButton: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: '#609966',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 20,
    zIndex: 100,
    // backgroundColor: 'red',
    paddingTop: 10,
  },
  drawerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  drawerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerCloseButton: {
    padding: 8,
  },
  drawerList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 100,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  drawerItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerItemContent: {
    flex: 1,
  },
  drawerItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  drawerItemDistance: {
    fontSize: 14,
    color: '#777777',
  },
  emptyDrawer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyDrawerText: {
    fontSize: 16,
    color: '#609966',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyDrawerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#609966',
    borderRadius: 8,
  },
  emptyDrawerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#609966',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Institutions;