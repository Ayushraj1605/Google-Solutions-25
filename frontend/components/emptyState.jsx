// components/orgOrders/EmptyState.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EmptyState = ({ activeTab, onRefresh }) => {
  // Determine message based on active tab
  const getMessage = () => {
    switch(activeTab) {
      case 'pending':
        return "No pending orders found for this date or pincode";
      case 'accepted':
        return "No accepted orders found for this date or pincode";
      case 'rejected':
        return "No rejected orders found for this date or pincode";
      case 'cancelled':
        return "No cancelled orders found for this date or pincode";
      case 'completed':
        return "No completed orders found for this date or pincode";
      default:
        return "No orders found for this date or pincode";
    }
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name="package-variant" 
        size={64} 
        color="#bdc3c7" 
      />
      <Text style={styles.emptyTitle}>No Orders</Text>
      <Text style={styles.emptyMessage}>{getMessage()}</Text>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={onRefresh}
      >
        <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
      
      <Text style={styles.tipText}>
        Try selecting a different date or pincode filter
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default EmptyState;