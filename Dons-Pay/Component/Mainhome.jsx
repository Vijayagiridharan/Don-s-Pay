import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const DonsPayLoginScreen = (props) => {
  useEffect(() => {
  }, []);


  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={styles.logo} />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.subtitle}>DonsPay</Text>
      
      <Text style={styles.tagline}>
      One-stop for all your campus payments.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buttonRectangle, styles.loginButton]}
          onPress={() => props.navigation.navigate("Fifth")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonRectangle, styles.registerButton]}
          onPress={() => props.navigation.navigate("Second")}
        >
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#DAA520",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#000",
    marginBottom: 15,
  },
  tagline: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonRectangle: {
    paddingVertical: 15,
    width: "70%",
    alignItems: "center",
    borderRadius: 50,
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButton: {
    backgroundColor: "#000",
  },
  registerButton: {
    backgroundColor: "#DAA520",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

export default DonsPayLoginScreen;
