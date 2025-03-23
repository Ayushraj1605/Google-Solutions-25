import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  Text
} from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Completely simplified version with direct use of React Native components
const RecycleForm = () => {
  const params = useLocalSearchParams();
  const deviceId = params.deviceId;

  // Form state
  const [formData, setFormData] = useState({
    modelNumber: '',
    imei: '',
    purchaseYear: '',
    description: '',
    invoice: null
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form on every change
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // Model number validation
    if (!formData.modelNumber.trim()) {
      newErrors.modelNumber = 'Model number is required';
      valid = false;
    }

    // Year validation if provided
    if (formData.purchaseYear) {
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.purchaseYear);
      
      if (formData.purchaseYear.length !== 4 || isNaN(year)) {
        newErrors.purchaseYear = 'Please enter a valid 4-digit year';
        valid = false;
      } else if (year > currentYear) {
        newErrors.purchaseYear = 'Year cannot be in the future';
        valid = false;
      } else if (year < 1990) {
        newErrors.purchaseYear = 'Please enter a year after 1990';
        valid = false;
      }
    }

    // IMEI validation if provided
    if (formData.imei && !/^\d{15}$/.test(formData.imei)) {
      newErrors.imei = 'IMEI should be 15 digits';
      valid = false;
    }

    setErrors(newErrors);
    setIsFormValid(valid);
    return valid;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      const updatedErrors = {...errors};
      delete updatedErrors[field];
      setErrors(updatedErrors);
    }
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
      setErrors(prev => ({...prev, invoice: 'Failed to upload invoice'}));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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

      // For demo, show loading for a moment
      setTimeout(() => {
        setLoading(false);
        router.back();
        router.replace({ pathname: '/organisationList', params: { refresh: Date.now() } });
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setErrors(prev => ({...prev, general: 'Submission failed. Please try again.'}));
      setLoading(false);
    }
  };

  // Render a form field with consistent styling
  const renderField = (label, field, value, keyboardType = 'default', multiline = false, optional = false) => {
    const isFocused = focused === field;
    const hasError = !!errors[field];
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {label} {!optional && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <View
          style={[
            styles.inputField,
            isFocused && styles.inputFieldFocused,
            hasError && styles.inputFieldError,
            multiline && styles.textArea
          ]}
        >
          <TextInput
            value={value}
            onChangeText={(text) => handleChange(field, text)}
            onFocus={() => setFocused(field)}
            onBlur={() => setFocused(null)}
            keyboardType={keyboardType}
            multiline={multiline}
            style={[
              styles.input,
              multiline && styles.textAreaInput
            ]}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </View>
        {hasError && (
          <Text style={styles.errorText}>{errors[field]}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Recycle Device</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>

          <View style={styles.formContainer}>
            {renderField('Model Number', 'modelNumber', formData.modelNumber)}
            {renderField('IMEI', 'imei', formData.imei, 'numeric', false, true)}
            {renderField('Year of Purchase', 'purchaseYear', formData.purchaseYear, 'numeric', false, true)}
            {renderField('Description', 'description', formData.description, 'default', true, true)}

            <TouchableOpacity 
              style={styles.uploadContainer}
              onPress={handleUploadInvoice}
            >
              <View style={styles.uploadContent}>
                <Ionicons 
                  name={formData.invoice ? "document" : "cloud-upload-outline"} 
                  size={24} 
                  color="#609966" 
                />
                <Text style={styles.uploadText}>
                  {formData.invoice ? 
                    `Invoice uploaded: ${formData.invoice.name}` : 
                    'Upload Invoice (Optional)'
                  }
                </Text>
              </View>
              {formData.invoice && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => setFormData({...formData, invoice: null})}
                >
                  <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {errors.invoice && (
              <Text style={styles.errorText}>{errors.invoice}</Text>
            )}
            
            {errors.general && (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !isFormValid && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Recycling Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#FF6B6B',
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  inputFieldFocused: {
    borderColor: '#609966',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFieldError: {
    borderColor: '#FF6B6B',
  },
  input: {
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  textArea: {
    minHeight: 120,
  },
  textAreaInput: {
    textAlignVertical: 'top',
    height: 100,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  uploadContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F8F0',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#609966',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  uploadText: {
    marginLeft: 12,
    color: '#609966',
    fontSize: 15,
    flex: 1,
  },
  removeButton: {
    padding: 5,
  },
  generalErrorContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  generalErrorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#609966',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#609966',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#B8D8B8',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecycleForm;