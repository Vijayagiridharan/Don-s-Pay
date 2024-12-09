import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Changed to Ionicons for consistency
import axios from 'axios';

const Sign = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = async () => {
    if (!firstName || !lastName || !pin || !email || !studentId || !phoneNumber) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post('http://10.0.0.6:8080/api/auth/register', {
        firstName,
        lastName,
        phoneNumber,
        studentId,
        email,
        pin,
      });
      console.log('User signed up:', response.data);
      alert('Signup successful!');
      navigation.navigate('First' , {studentId, phoneNumber}); // Navigate to the appropriate screen
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
    clearFields();
  };

  const clearFields = () => {
    setFirstName('');
    setLastName('');
    setPin('');
    setConfirmPin('');
    setEmail('');
    setPhoneNumber('');
    setStudentId('');
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('First')} // Navigate back to Mainhome
      >
        <Icon name="arrow-back" size={35} color="#DAA520" />
      </TouchableOpacity>

      <Text style={styles.title}>User Registration</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

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
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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

      <TouchableOpacity style={[styles.buttonRectangle]} onPress={clearFields}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttonRectangle]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
    marginVertical: 10,
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

export default Sign;
