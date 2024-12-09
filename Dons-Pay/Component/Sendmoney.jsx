import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SendMoneyScreen = ({ route }) => {
  const { phoneNumber, qrData, token, studentId } = route.params;
  const navigation = useNavigation();

  const [donDollarsBalance, setDonDollarsBalance] = useState(0);
  const [mealSwipesBalance, setMealSwipesBalance] = useState(0);
  const [selectedBalanceType, setSelectedBalanceType] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pre-fill merchant data from QR
  const merchantName = qrData?.merchantName || 'Unknown Merchant';
  const merchantNumber = qrData?.merchantNumber || '';
  const merchantId = qrData?.merchantId || '';

  // Fetch balance from the backend and update cache
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Check cache first
        const cachedBalance = await AsyncStorage.getItem('userBalance');
        if (cachedBalance) {
          const { donDollarsBalance, mealSwipesBalance } = JSON.parse(cachedBalance);
          setDonDollarsBalance(donDollarsBalance || 0);
          setMealSwipesBalance(mealSwipesBalance || 0);
        }

        // Fetch from API
        const response = await axios.get('http://10.0.0.6:8080/api/user/balance', {
          params: { phoneNumber },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update state and cache
        const newBalance = {
          donDollarsBalance: response.data.donDollarsBalance || 0,
          mealSwipesBalance: response.data.mealSwipesBalance || 0,
        };
        setDonDollarsBalance(newBalance.donDollarsBalance);
        setMealSwipesBalance(newBalance.mealSwipesBalance);

        await AsyncStorage.setItem('userBalance', JSON.stringify(newBalance));
      } catch (error) {
        console.error('Error fetching balance:', error);
        Alert.alert('Error', 'Unable to fetch balance.');
      }
    };

    fetchBalance();
  }, [phoneNumber, studentId]);

  const handleSendMoney = async () => {
    if (!selectedBalanceType) {
      Alert.alert('Balance Type Required', 'Please select a balance type to proceed.');
      return;
    }

    const amount = parseFloat(enteredAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    const availableBalance =
      selectedBalanceType === 'DON_DOLLARS' ? donDollarsBalance : mealSwipesBalance;

    if (amount > availableBalance) {
      Alert.alert('Insufficient Balance', 'The entered amount exceeds the available balance.');
      return;
    }

    try {
      await axios.post(
        'http://10.0.0.6:8080/api/transactions/sendMoney',
        {
          phoneNumber,
          merchantNumber,
          merchantId,
          amount,
          balanceType: selectedBalanceType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update balance locally
      const updatedBalance = {
        donDollarsBalance:
          selectedBalanceType === 'DON_DOLLARS'
            ? donDollarsBalance - amount
            : donDollarsBalance,
        mealSwipesBalance:
          selectedBalanceType === 'MEAL_SWIPES'
            ? mealSwipesBalance - amount
            : mealSwipesBalance,
      };

      setDonDollarsBalance(updatedBalance.donDollarsBalance);
      setMealSwipesBalance(updatedBalance.mealSwipesBalance);

      // Update cache
      await AsyncStorage.setItem('userBalance', JSON.stringify(updatedBalance));

      setShowSuccessModal(true); // Show success modal
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Fourth', { phoneNumber, token, refresh: true, studentId });
      }, 2000);
    } catch (error) {
      console.error('Error sending money:', error);
      Alert.alert('Error', error.response?.data?.message || 'An error occurred while processing the transaction.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.currentBalance}>Current balance</Text>

      {/* Balance Display */}
      <View style={styles.balanceContainer}>
        <TouchableOpacity
          style={[
            styles.balanceCard,
            selectedBalanceType === 'DON_DOLLARS' && styles.selectedCard,
          ]}
          onPress={() => setSelectedBalanceType('DON_DOLLARS')}
        >
          <Text style={styles.balanceTitle}>Don Dollars</Text>
          <Text style={styles.balanceValue}>${donDollarsBalance.toFixed(2)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.balanceCard,
            selectedBalanceType === 'MEAL_SWIPES' && styles.selectedCard,
          ]}
          onPress={() => setSelectedBalanceType('MEAL_SWIPES')}
        >
          <Text style={styles.balanceTitle}>Meal Swipes</Text>
          <Text style={styles.balanceValue}>{mealSwipesBalance}</Text>
        </TouchableOpacity>
      </View>

      {/* Merchant Info */}
      <Text style={styles.merchantLabel}>Merchant Name</Text>
      <Text style={styles.merchantValue}>{merchantName}</Text>

      <Text style={styles.merchantLabel}>Merchant ID</Text>
      <Text style={styles.merchantValue}>{merchantNumber}</Text>

      {/* Amount Input */}
      <Text style={styles.inputLabel}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="$"
        placeholderTextColor="#FFFFFF"
        value={enteredAmount}
        onChangeText={setEnteredAmount}
      />

      {/* Send Money Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendMoney}>
        <Text style={styles.buttonText}>Send Money</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={100} color="green" />
            <Text style={styles.successText}>Transaction Successful!</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6F61',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 5,
  },
  currentBalance: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 5,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#A52A2A',
    borderWidth: 2,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  merchantLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 5,
  },
  merchantValue: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 5,
  },
  input: {
    fontSize: 20,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A52A2A',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
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
    borderRadius: 10,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    color: 'green',
    marginTop: 15,
  },
});

export default SendMoneyScreen;
