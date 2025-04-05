import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const OrderCard = ({ order, isSelected, onSelect }) => {
  // Ensure we have valid data with fallbacks
  const {
    id = 'Unknown ID',
    deviceName = 'Unknown Device',
    description = 'No description',
    status = 'pending',
    date = 'Unknown date',
    pincode = 'Unknown',
    userAddress = { address: 'Unknown', city: 'Unknown' }
  } = order || {};

  // Map status to colors and display text
  const statusConfig = {
    pending: { color: '#f39c12', text: 'Pending' },
    indonation: { color: '#f39c12', text: 'Pending Donation' },
    accepted: { color: '#3498db', text: 'Accepted' },
    processing: { color: '#3498db', text: 'Processing' },
    accept: { color: '#3498db', text: 'Accepted' },
    completed: { color: '#2ecc71', text: 'Completed' },
    done: { color: '#2ecc71', text: 'Completed' },
    cancelled: { color: '#e74c3c', text: 'Cancelled' },
    rejected: { color: '#e74c3c', text: 'Rejected' },
    reject: { color: '#e74c3c', text: 'Rejected' }
  };

  const { color: statusColor, text: statusText } = statusConfig[status.toLowerCase()] || 
    { color: '#95a5a6', text: 'Unknown' };

  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      {/* Top section with checkbox and order ID */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={onSelect} style={styles.checkbox}>
          <MaterialCommunityIcons
            name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
            size={22}
            color="#2ecc71"
          />
        </TouchableOpacity>
        
        <View style={styles.idSection}>
          <Text style={styles.idLabel}>Order ID:</Text>
          <Text style={styles.idValue} numberOfLines={1}>
            {id || 'Unknown'}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Device information */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="devices" size={16} color="#555" />
          <Text style={styles.detailLabel}>Device:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {deviceName}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="text-box-outline" size={16} color="#555" />
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {description}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar" size={16} color="#555" />
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{date}</Text>
        </View>
      </View>
      
      {/* Address information */}
      <View style={styles.addressSection}>
        <View style={styles.addressHeader}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#555" />
          <Text style={styles.addressLabel}>Delivery Address:</Text>
        </View>
        
        <Text style={styles.addressValue} numberOfLines={2}>
          {userAddress.address}, {userAddress.city}, {pincode}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedCard: {
    borderColor: '#2ecc71',
    borderWidth: 2,
    backgroundColor: '#f7fcfa',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 10,
  },
  idSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
    marginRight: 4,
  },
  idValue: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 4,
    width: 45,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  addressSection: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
    marginLeft: 6,
  },
  addressValue: {
    fontSize: 13,
    color: '#2c3e50',
    paddingLeft: 22,
  },
});

export default OrderCard;