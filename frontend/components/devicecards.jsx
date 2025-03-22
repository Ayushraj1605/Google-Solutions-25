import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const DeviceCard = ({ data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecyclePress = () => {
    setIsSubmitting(true);
    router.push('/recycleform');
    setIsSubmitting(false);
  };

  const handleViewDetails = () => {
    router.push({
      pathname: '/device-details',
      params: { deviceId: data.deviceId }
    });
  };

  // Default values if data is incomplete
  const deviceName = data?.deviceName || "Eco-Friendly Recycling";
  const deviceType = data?.deviceType || "Make the world greener";
  const imageUrl = data?.imageUrl || 'https://picsum.photos/700';
  const deviceId = data?.deviceId || "Unknown";
  const recycleStatus = data?.recycleStatus || false;

  // Status indicator color
  const statusColor = recycleStatus ? '#FFB74D' : '#4CAF50';
  const statusText = recycleStatus ? "In Progress" : "Ready to Recycle";

  return (
    <View style={styles.container}>
      {/* Status indicator */}
      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Left side: Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/svg/logo')} 
              style={styles.logo}
            />
          </View>
        </View>

        {/* Right side: Info and buttons */}
        <View style={styles.infoContainer}>
          {/* Device details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={1}>{deviceName}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{deviceType}</Text>
            <View style={styles.idContainer}>
              <Text style={styles.idLabel}>ID:</Text>
              <Text style={styles.idValue}>{deviceId}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={handleViewDetails}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.recycleButton, 
                recycleStatus && styles.recycleButtonDisabled
              ]}
              onPress={!recycleStatus ? handleRecyclePress : null}
              disabled={recycleStatus || isSubmitting}
              activeOpacity={recycleStatus ? 1 : 0.7}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.recycleButtonText}>
                  {recycleStatus ? "Processing" : "Recycle"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    height: 120, // Fixed compact height
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  imageContainer: {
    width: 120,
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 2,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  idValue: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  recycleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  recycleButtonDisabled: {
    backgroundColor: '#888',
  },
  recycleButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeviceCard;