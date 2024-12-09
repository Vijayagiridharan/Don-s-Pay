import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Changed to Ionicons for consistency
import Snackbar from 'react-native-snackbar';
import axios from 'axios';

const Login = ({ route, navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = async () => {
    if (!phoneNumber || !studentId || !pin) {
      showSnackbar('Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post('http://10.0.0.6:8080/api/auth/login', {
        phoneNumber,
        studentId,
        pin,
      });

      const user = response.data; // Backend returns user details as JSON
      const token = response.data.token;

      console.log(`response is: `, response.data);

      if (user) {
        navigation.navigate('Fourth', { phoneNumber, studentId, token });
      } else {
        showSnackbar('User not found');
      }
    } catch (error) {
      console.error('Login failed: ', error);
      showSnackbar('Login failed. Please try again.');
    }
  };

  const showSnackbar = (message) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('First')} // Navigate to Mainhome
      >
        <Icon name="arrow-back" size={35} color="#DAA520" />
      </TouchableOpacity>

      <Text style={styles.title}>User Login</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Student ID"
          value={studentId}
          onChangeText={setStudentId}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          value={pin}
          secureTextEntry={true}
          onChangeText={setPin}
        />
      </View>
      <TouchableOpacity style={styles.buttonRectangle} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10, // Positioned on the top-left corner
    padding: 10,
    borderRadius: 5,
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

export default Login;
