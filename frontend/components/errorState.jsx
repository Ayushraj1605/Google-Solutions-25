// components/orgOrders/ErrorState.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ErrorState = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#e74c3c" />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error || 'Failed to load orders'}</Text>
      
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={onRetry}
      >
        <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ErrorState;