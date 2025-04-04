// components/orgOrders/OrderCard.js
import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OrderCard = ({ order, isSelected, onSelect }) => {
  // Handle both capitalized and lowercase status
  const status = order.status.toLowerCase();
  
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return '#3498db'; // Blue
      case 'completed':
        return '#2ecc71'; // Green
      case 'cancelled':
        return '#e74c3c'; // Red
      case 'accepted':
        return '#9b59b6'; // Purple
      default:
        return '#95a5a6'; // Gray
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'clock-outline';
      case 'completed':
        return 'check-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      case 'accepted':
        return 'progress-check';
      default:
        return 'help-circle-outline';
    }
  };
  
  return (
    <View style={[styles.orderCard, isSelected && styles.selectedCard]}>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={onSelect}>
          <MaterialCommunityIcons 
            name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"} 
            size={24} 
            color="#2ecc71" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order: {order.orderId || order.id}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <MaterialCommunityIcons name={getStatusIcon(status)} size={14} color="#fff" />
            <Text style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderContent}>
          <View style={styles.deviceImageContainer}>
            {order.imageUrl ? (
              <Image 
                source={{ uri: order.imageUrl }} 
                style={styles.deviceImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.deviceImagePlaceholder}>
                <MaterialCommunityIcons 
                  name={
                    (order.deviceName || '').toLowerCase().includes('iphone') || 
                    (order.deviceName || '').toLowerCase().includes('smartphone') ? 'cellphone' :
                    (order.deviceName || '').toLowerCase().includes('laptop') ? 'laptop' :
                    (order.deviceName || '').toLowerCase().includes('tv') ? 'television' :
                    (order.deviceName || '').toLowerCase().includes('ipad') || 
                    (order.deviceName || '').toLowerCase().includes('tablet') ? 'tablet' :
                    (order.deviceName || '').toLowerCase().includes('headphone') ? 'headphones' :
                    (order.deviceName || '').toLowerCase().includes('printer') ? 'printer' :
                    (order.deviceName || '').toLowerCase().includes('mouse') ? 'mouse' :
                    'devices'
                  } 
                  size={36} 
                  color="#7f8c8d" 
                />
              </View>
            )}
          </View>
          
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{order.deviceName}</Text>
            <Text style={styles.deviceId}>Device ID: {order.deviceId}</Text>
            <Text style={styles.deviceDescription} numberOfLines={2}>
              {order.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.addressContainer}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color="#7f8c8d" />
          <Text style={styles.addressText}>
            {order.userAddress?.address}, {order.userAddress?.city} - {order.pincode}
          </Text>
        </View>
        
        <View style={styles.orderFooter}>
          <View style={styles.footerInfo}>
            <MaterialCommunityIcons name="account-outline" size={16} color="#7f8c8d" />
            <Text style={styles.footerText}>
              {order.userName || order.userId}
            </Text>
          </View>
          
          <View style={styles.footerInfo}>
            <MaterialCommunityIcons name="phone-outline" size={16} color="#7f8c8d" />
            <Text style={styles.footerText}>
              {order.userPhone || order.contactNumber || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  checkboxContainer: {
    padding: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  cardContent: {
    flex: 1,
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
    flexDirection: 'column',
  },
  orderId: {
    fontSize: 14,
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
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderContent: {
    flexDirection: 'row',
    padding: 12,
  },
  deviceImageContainer: {
    marginRight: 12,
  },
  deviceImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  deviceImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  deviceId: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  deviceDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  addressText: {
    fontSize: 13,
    color: '#34495e',
    marginLeft: 6,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
});

export default OrderCard;