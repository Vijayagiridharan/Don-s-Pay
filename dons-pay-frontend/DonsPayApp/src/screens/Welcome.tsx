import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { WelcomeScreenNavigationProp } from '../navigation/types';

const Welcome = ({ navigation }: { navigation: WelcomeScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DonsPay!</Text>
      <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonRectangle} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRectangle} onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;