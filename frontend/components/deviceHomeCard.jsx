import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DeviceCard = ({
  deviceName,
  deviceId,
  deviceType,
  description,
  imageUri = null,
  status = "inDonation",
  createdAt = new Date(),
  onCardPress = null,
  onShare = () => console.log('Share pressed'),
  onContact = () => console.log('Contact pressed'),
}) => {
  const [isRequested, setIsRequested] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(!!imageUri);
  const [interested, setInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(Math.floor(Math.random() * 20) + 3);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusColor = {
    pending: '#3498db',
    completed: '#2ecc71',
    cancelled: '#e74c3c',
    accepted: '#9b59b6',
    inDonation: '#f39c12'
  }[status.toLowerCase()] || '#95a5a6';

  const statusIcon = {
    pending: 'clock-outline',
    completed: 'check-circle-outline',
    cancelled: 'close-circle-outline',
    accepted: 'progress-check',
    inDonation: 'gift-outline'
  }[status.toLowerCase()] || 'help-circle-outline';

  React.useEffect(() => {
    if (!isImageLoading) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isImageLoading, opacityAnim]);

  const handleButtonPress = (action) => {
    return () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
      action();
    };
  };

  const handleInterest = () => {
    setInterested(!interested);
    setInterestCount(interested ? interestCount - 1 : interestCount + 1);
  };

  const CardWrapper = onCardPress
    ? ({ children }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onCardPress}
        style={{ width: '100%' }}
      >
        {children}
      </TouchableOpacity>
    )
    : ({ children }) => <View style={{ width: '100%' }}>{children}</View>;

    return (
      <CardWrapper>
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>{deviceName}</Text>
              <Text style={styles.orderDate}>{formatDate(new Date(createdAt))}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <MaterialCommunityIcons name={statusIcon} size={14} color="#fff" />
              <Text style={styles.statusText}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.metaContainer}>
            <View style={[styles.categoryPill, { backgroundColor: '#e8f4f8' }]}>
              <Text style={[styles.categoryText, { color: '#3498db' }]}>{deviceType}</Text>
            </View>
            <View style={styles.idPill}>
              <MaterialCommunityIcons name="identifier" size={12} color="#7f8c8d" />
              <Text style={styles.idText}>{deviceId}</Text>
            </View>
          </View>
          
          <View style={styles.contentContainer}>
            {imageUri && (
              <View style={styles.imageWrapper}>
                <Animated.View style={[styles.imageContainer, { opacity: opacityAnim }]}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.coverImage}
                    resizeMode="cover"
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoadEnd={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                </Animated.View>
    
                {isImageLoading && (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color="#2ecc71" />
                  </View>
                )}
              </View>
            )}
            
            <View style={styles.textContent}>
              <Text style={styles.description} numberOfLines={4}>
                {description}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderFooter}>
            <TouchableOpacity 
              style={[
                styles.requestButton, 
                { 
                  backgroundColor: isRequested ? '#95a5a6' : '#2ecc71',
                  opacity: isRequested ? 0.7 : 1
                }
              ]}
              onPress={() => {
                if (!isRequested) {
                  Alert.alert(
                    "Confirm Request",
                    "Are you sure you want to request this device?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel"
                      },
                      { 
                        text: "Confirm", 
                        onPress: () => {
                          setIsRequested(true);
                          // Add any additional request handling logic here
                        } 
                      }
                    ]
                  );
                }
              }}
              disabled={isRequested}
            >
              <Text style={styles.requestButtonText}>
                {isRequested ? "Requested" : "Request"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={handleButtonPress(onContact)}>
              <MaterialCommunityIcons name="message-outline" size={20} color="#7f8c8d" />
              <Text style={styles.socialButtonText}>Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={handleButtonPress(onShare)}>
              <MaterialCommunityIcons name="share-outline" size={20} color="#7f8c8d" />
              <Text style={styles.socialButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </CardWrapper>
    );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  orderDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  idPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  contentContainer: {
    paddingBottom: 12,
  },
  imageWrapper: {
    marginHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
    height: 180,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  textContent: {
    paddingHorizontal: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  socialButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default DeviceCard;