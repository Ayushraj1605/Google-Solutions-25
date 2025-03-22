import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';

const RecycleForm = () => {
  const params = useLocalSearchParams();
  const deviceId = params.deviceId;

  const [formData, setFormData] = useState({
    modelNumber: '',
    imei: '',
    purchaseYear: '',
    description: '',
    invoice: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateYear = (year) => {
    if (year && (year.length !== 4 || isNaN(year))) {
      setError('Please enter a valid 4-digit year');
      return false;
    }
    return true;
  };

  const handleUploadInvoice = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (!result.canceled) {
        setFormData(prev => ({...prev, invoice: result.assets[0]}));
      }
    } catch (err) {
      console.error('Invoice upload failed:', err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.modelNumber) {
      setError('Model number is required');
      return;
    }

    if (!validateYear(formData.purchaseYear)) return;

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('deviceId', deviceId);
      formPayload.append('modelNumber', formData.modelNumber);
      formPayload.append('imei', formData.imei);
      formPayload.append('purchaseYear', formData.purchaseYear);
      formPayload.append('description', formData.description);
      
      if (formData.invoice) {
        formPayload.append('invoice', {
          uri: formData.invoice.uri,
          name: formData.invoice.name,
          type: formData.invoice.mimeType
        });
      }

      await axios.post(
        'https://cloudrunservice-254131401451.us-central1.run.app/recycle',
        formPayload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      router.back();
      router.replace({ pathname: '/devices', params: { refresh: Date.now() } });
    } catch (err) {
      console.error('Submission error:', err);
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recycle Device</Text>

      <TextInput
        label="Model Number *"
        value={formData.modelNumber}
        onChangeText={text => {
          setFormData({...formData, modelNumber: text});
          setError('');
        }}
        style={styles.input}
        error={!!error}
      />

      <TextInput
        label="IMEI (Optional)"
        value={formData.imei}
        onChangeText={text => setFormData({...formData, imei: text})}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Year of Purchase"
        value={formData.purchaseYear}
        onChangeText={text => setFormData({...formData, purchaseYear: text})}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Description (Optional)"
        value={formData.description}
        onChangeText={text => setFormData({...formData, description: text})}
        style={styles.input}
        multiline
      />

      <Button 
        mode="outlined" 
        style={styles.uploadButton}
        onPress={handleUploadInvoice}
      >
        {formData.invoice ? 'Invoice Uploaded' : 'Upload Invoice (Optional)'}
      </Button>

      {error && <HelperText type="error">{error}</HelperText>}

      <Button 
        mode="contained" 
        loading={loading}
        disabled={loading}
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={styles.buttonLabel}
      >
        Submit Recycling Request
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  uploadButton: {
    marginVertical: 10,
    borderColor: '#609966',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#609966',
    borderRadius: 8,
  },
  buttonLabel: {
    color: '#fff',
  },
});

export default RecycleForm;
