import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const DonsPayLoginScreen = (props) => {
  useEffect(() => {
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DonsPay!</Text>
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonRectangle} onPress={() => props.navigation.navigate('Fifth')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRectangle} onPress={() => props.navigation.navigate('Second')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   inputContainer: {
//     width: '100%',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   button: {
//     width: '100%',
//     backgroundColor: '#FF7B66',
//     borderRadius: 10,
//     paddingVertical: 12,
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
export default DonsPayLoginScreen;
