import React from 'react';
import { Text, TouchableOpacity, Alert, Platform } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { styles } from '../styles/styles';
import type { ScannerScreenNavigationProp } from '../navigation/types';

interface ScannerProps {
  navigation: ScannerScreenNavigationProp;
}

const Scanner: React.FC<ScannerProps> = ({ navigation }) => {
  const onSuccess = (e: { data: string }) => {
    try {
      const scannedData = JSON.parse(e.data);
      Alert.alert(
        'Payment Details',
        `Payment to ${scannedData.name} for $${scannedData.amount}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Landing', { name: 'User' })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid QR Code');
    }
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.auto}
      topContent={
        <Text style={styles.centerText}>
          Scan the QR code to make payment
        </Text>
      }
      bottomContent={
        <TouchableOpacity 
          style={styles.buttonRectangle}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel Scan</Text>
        </TouchableOpacity>
      }
    />
  );
};

export default Scanner;