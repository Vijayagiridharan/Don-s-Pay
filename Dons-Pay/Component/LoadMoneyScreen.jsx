import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import axios from 'axios';

// Custom Error Handling Component
const ErrorMessage = ({ message }) => (
  <View style={styles.errorContainer}>
    <Icon name="warning" size={20} color="#FF6B6B" />
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

// Success Modal Component
// Option 1: Remove Lottie entirely
const SuccessModal = ({ visible, onClose, amount }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon 
            name="checkmark-circle" 
            size={100} 
            color="#6C63FF" 
          />
          <Text style={styles.successTitle}>Funds Added Successfully!</Text>
          <Text style={styles.successSubtitle}>
            ${amount} has been added to your Don $$ Balance
          </Text>
          <TouchableOpacity 
            style={styles.okButton}
            onPress={onClose}
          >
            <Text style={styles.okButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Remove LottieView import
const LoadMoneyScreen = ({ route, navigation }) => {
  const { studentId, token, phoneNumber } = route.params;
  
  // Enhanced State Management
  const [formData, setFormData] = useState({
    amount: '',
    cardNumber: '',
    cardExpiry: '',
    cvv: '',
    cardHolderName: '',
  });

  const [errors, setErrors] = useState({});
  const [donDollarBalance, setDonDollarBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation Functions (same as before)
  const validateForm = () => {
    const newErrors = {};

    // Amount Validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    // Card Number Validation (basic 16-digit check)
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card Number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number (16 digits required)';
    }

    // Expiry Validation (MM/YY format)
    if (!formData.cardExpiry) {
      newErrors.cardExpiry = 'Expiry is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Invalid expiry (MM/YY format)';
    }

    // CVV Validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Cardholder Name Validation
    if (!formData.cardHolderName) {
      newErrors.cardHolderName = 'Cardholder Name is required';
    } else if (formData.cardHolderName.length < 3) {
      newErrors.cardHolderName = 'Name too short';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch Balance on Component Mount (same as before)
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('https://don-s-pay.onrender.com/api/user/balance', {
          params: { phoneNumber },
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonDollarBalance(response.data.donDollarsBalance || 0);
      } catch (error) {
        console.error('Balance Fetch Error:', error);
        setErrors(prev => ({
          ...prev, 
          networkError: 'Unable to fetch current balance'
        }));
      }
    };

    fetchBalance();
  }, []);

  // Handle Money Loading
  const handleLoadMoney = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        'https://don-s-pay.onrender.com/api/transactions/addMoney',
        { 
          studentId, 
          amount: parseFloat(formData.amount),
          paymentMethod: {
            cardNumber: formData.cardNumber,
            cardExpiry: formData.cardExpiry,
            cardHolderName: formData.cardHolderName,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Show success modal instead of immediate navigation
        setShowSuccessModal(true);
        setDonDollarBalance(prev => prev + parseFloat(formData.amount));
      }
    } catch (error) {
      console.error('Load Money Error:', error);
      setErrors({
        networkError: error.response?.data?.message || 'Transaction failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close and navigation
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.navigate('Fourth', { 
      phoneNumber, 
      token, 
      refresh: true, 
      studentId
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Success Modal */}
      <SuccessModal 
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        amount={parseFloat(formData.amount).toFixed(2)}
      />

      <LinearGradient 
        colors={['#6C63FF', '#7E85FF']} 
        style={styles.topSection}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>Add Funds</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Don $$ Balance</Text>
            <Text style={styles.balanceAmount}>${donDollarBalance.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          {errors.networkError && (
            <ErrorMessage message={errors.networkError} />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount to Load</Text>
            <TextInput
              style={[
                styles.input, 
                errors.amount && styles.inputError
              ]}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#A0A0A0"
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={[
                styles.input, 
                errors.cardNumber && styles.inputError
              ]}
              keyboardType="numeric"
              maxLength={16}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#A0A0A0"
              value={formData.cardNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cardNumber: text }))}
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Expiry</Text>
              <TextInput
                style={[
                  styles.input, 
                  errors.cardExpiry && styles.inputError
                ]}
                placeholder="MM/YY"
                placeholderTextColor="#A0A0A0"
                maxLength={5}
                value={formData.cardExpiry}
                onChangeText={(text) => {
                  // Auto-format expiry
                  const cleaned = text.replace(/\D+/g, '');
                  const formatted = cleaned.length > 2 
                    ? `${cleaned.slice(0,2)}/${cleaned.slice(2,4)}` 
                    : cleaned;
                  setFormData(prev => ({ ...prev, cardExpiry: formatted }));
                }}
              />
              {errors.cardExpiry && <Text style={styles.errorText}>{errors.cardExpiry}</Text>}
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={[
                  styles.input, 
                  errors.cvv && styles.inputError
                ]}
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
                maxLength={4}
                placeholder="123"
                value={formData.cvv}
                onChangeText={(text) => setFormData(prev => ({ ...prev, cvv: text }))}
              />
              {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={[
                styles.input, 
                errors.cardHolderName && styles.inputError
              ]}
              placeholder="John Doe"
              placeholderTextColor="#A0A0A0"
              value={formData.cardHolderName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cardHolderName: text }))}
            />
            {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName}</Text>}
          </View>

          <TouchableOpacity 
            style={[
              styles.loadButton, 
              isLoading && styles.loadingButton
            ]} 
            onPress={handleLoadMoney}
            disabled={isLoading}
          >
            <Text style={styles.loadButtonText}>
              {isLoading ? 'Processing...' : 'Add Funds'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
 
  

  // New styles for Success Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginTop: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#34495E',
    marginTop: 10,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    width: '100%',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6C63FF',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#6C63FF',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#6C63FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loadButton: {
    backgroundColor: '#6C63FF',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  successText: {
    fontSize: 18,
    color: 'green',
    marginTop: 15,
    fontWeight: 'bold',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputGroup: {
    marginTop: 15,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 10,
    fontSize: 12,
  },
  loadingButton: {
    opacity: 0.6,
  },
});

export default LoadMoneyScreen;