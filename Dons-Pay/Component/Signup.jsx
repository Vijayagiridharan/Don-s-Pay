import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";


const Sign = ({ navigation, route }) => {
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = async () => {
    // Validate form fields
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
        pin
      });
      console.log('User signed up:', response.data);
      alert('Signup successful!');
      navigation.navigate('Third');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }

    navigation.navigate('Third');

    // Clear fields after submission
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
      <Text style={styles.title}>User Registration</Text>
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Student Id" value={studentId} onChangeText={setStudentId} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={pin} onChangeText={setPin} />
      <TouchableOpacity style={[styles.buttonRectangle]} onPress={clearFields}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonRectangle]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

//   return (
//     <View style={styles.container}>
//       <View style={styles.topContainer}>
//         <Text style={styles.title}>Sign Up Form</Text>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="First Name"
//             value={firstName}
//             onChangeText={setFirstName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Last Name"
//             value={lastName}
//             onChangeText={setLastName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Student Id"
//             value={studentId}
//             onChangeText={setStudentId}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//           />
//           <View style={styles.pinContainer}>
//             <TextInput
//               style={[styles.input, styles.pinInput]}
//               placeholder="Enter PIN"
//               value={pin}
//               onChangeText={setPin}
//               secureTextEntry={!showPin}
//               keyboardType="numeric"
//               maxLength={4}
//             />
//             <Icon
//               name={showPin ? 'eye-slash' : 'eye'}
//               size={20}
//               color="#333"
//               style={styles.eyeIcon}
//               onPress={() => setShowPin(!showPin)}
//             />
//           </View>
//           <TextInput
//             style={styles.input}
//             placeholder="Confirm PIN"
//             value={confirmPin}
//             onChangeText={setConfirmPin}
//             secureTextEntry={!showPin}
//             keyboardType="numeric"
//             maxLength={4}
//           />
//         </View>
//       </View>
//       <View style={styles.bottomContainer}>
//         <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={clearFields}>
//           <Text style={styles.buttonText}>Clear</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  detailsContainer: {
    width: '80%',
    alignItems: 'center',
    padding: 20,
  },
  input2: {
    width: '100%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginVertical: 15,
    paddingLeft: 10,
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#DAA520',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonRectangle: {
    backgroundColor: '#000',
    padding: 15,
    width: '60%',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#DAA520',
    fontSize: 18,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
});
export default Sign;
