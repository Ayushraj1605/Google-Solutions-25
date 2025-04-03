// components/orgOrders/ActionButtons.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ActionButtons = ({ selectedCount, onAccept, onReject, processing }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.selectionText}>
        {selectedCount} order{selectedCount !== 1 ? 's' : ''} selected
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onReject}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reject</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAccept}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Accept</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ActionButtons;