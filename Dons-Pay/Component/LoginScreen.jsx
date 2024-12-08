import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';

const Login = ({ route, navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

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
      const token =  response.data.token;

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
      <Text style={styles.title}>User Login</Text>
      <TextInput style={styles.input} placeholder="Student Id" value={studentId} onChangeText={setStudentId} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />
      <TextInput style={styles.input} placeholder="Password" value={pin} onChangeText={setPin} />
      <TouchableOpacity style={styles.buttonRectangle} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

//   return (
//     <View style={styles.container}>
//       <View style={styles.topContainer}>
//         <Text style={styles.title}>Enter Your PIN</Text>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="phone-pad"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Student ID"
//             value={studentId}
//             onChangeText={setStudentId}
//             keyboardType="numeric"
//           />
//           <View style={styles.pinContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Pin"
//               value={pin}
//               onChangeText={setPin}
//               secureTextEntry={!showPin}
//               keyboardType="numeric"
//             />
//             <Icon
//               name={showPin ? 'eye-slash' : 'eye'}
//               size={20}
//               color="#333"
//               style={styles.eyeIcon}
//               onPress={() => setShowPin(!showPin)}
//             />
//           </View>
//         </View>
//       </View>
//       <View style={styles.bottomContainer}>
//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 40,
//     paddingBottom: 20,
//     backgroundColor: '#fff',
//   },
//   topContainer: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   bottomContainer: {
//     justifyContent: 'flex-end',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   inputContainer: {
//     width: '100%',
//   },
//   input: {
//     borderRadius: 15,
//     backgroundColor: 'white',
//     marginBottom: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     width: '100%',
//     color: 'black',
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   pinContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'relative',
//     width: '100%',
//   },
//   pinInput: {
//     flex: 1,
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 10,
//     top: '50%',
//     marginTop: -15,
//   },
//   button: {
//     backgroundColor: '#FF7B66',
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 18,
//   },
// });
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

export default Login;
