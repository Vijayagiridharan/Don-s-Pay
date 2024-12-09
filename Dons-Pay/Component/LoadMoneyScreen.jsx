import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const LoadMoneyScreen = ({ route, navigation }) => {
  const { studentId, token, phoneNumber } = route.params;
  const [amount, setAmount] = useState('');

  const handleLoadMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to load.');
      return;
    }

    try {
      console.log('Sending Load Money Request:', {
        studentId,
        amount: parseFloat(amount),
      });

      const response = await axios.post(
        'http://10.0.0.6:8080/api/transactions/addMoney',
        { studentId, amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Load Money Response:', response.data);
        Alert.alert('Success', 'Money loaded successfully!');
        setAmount(''); // Clear the amount field
        navigation.navigate('Fourth', { phoneNumber, token, refresh: true, studentId}); // Refresh balance on return
      } else {
        console.error('Unexpected Response:', response);
        Alert.alert('Error', 'Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      console.error('Error loading money:', error);

      if (error.response) {
        console.error('Error Response:', error.response.data);
        Alert.alert(
          'Error',
          error.response.data.message || 'Failed to load money. Please try again.'
        );
      } else if (error.request) {
        console.error('No Response:', error.request);
        Alert.alert(
          'Error',
          'No response from server. Please check your network and try again.'
        );
      } else {
        console.error('Request Setup Error:', error.message);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={35} color="#DAA520" />
      </TouchableOpacity>

      <Text style={styles.title}>Load Money</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount to load"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <TouchableOpacity style={styles.buttonRectangle} onPress={handleLoadMoney}>
        <Text style={styles.buttonText}>Load Money</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: '#DAA520',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    color: '#DAA520',
    fontSize: 14,
    zIndex: 1,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#DAA520',
    borderWidth: 2,
    borderRadius: 8,
    paddingLeft: 15,
    color: '#000',
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonRectangle: {
    backgroundColor: '#000',
    paddingVertical: 15,
    width: '60%',
    alignItems: 'center',
    marginVertical: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#DAA520',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default LoadMoneyScreen;
