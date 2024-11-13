// QRCodeScanner.js
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const QRCodeScreen = ({ onBack }) => {
  const [isReactivate, setIsReactivate] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [mounted, setMounted] = useState(false);

  const requestCameraPermission = useCallback(async () => {
    try {
      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      });

      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
        return true;
      }
      
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in your device settings to use the QR scanner.',
        [
          { text: 'Cancel', style: 'cancel', onPress: onBack },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      
      return false;
    } catch (error) {
      console.error('Permission check error:', error);
      Alert.alert('Error', 'Failed to check camera permissions');
      return false;
    }
  }, [onBack]);

  useEffect(() => {
    setMounted(true);
    requestCameraPermission();

    return () => {
      setMounted(false);
      setIsReactivate(false);
    };
  }, [requestCameraPermission]);

  const handleSuccess = useCallback((e) => {
    if (!mounted) return;
    
    setIsReactivate(false);
    Alert.alert(
      'QR Code Detected',
      e.data,
      [
        {
          text: 'OK',
          onPress: () => mounted && setIsReactivate(true)
        }
      ]
    );
  }, [mounted]);

  if (!mounted || !hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={handleSuccess}
        reactivate={isReactivate}
        reactivateTimeout={1000} // Increased timeout
        showMarker={true}
        cameraStyle={styles.cameraContainer}
        containerStyle={styles.container}
        permissionDialogTitle="Camera Permission"
        permissionDialogMessage="We need your permission to use the camera"
        buttonPositive="OK"
        topContent={
          <Text style={styles.centerText}>
            Please align the QR code within the frame
          </Text>
        }
        bottomContent={
          <View style={styles.buttonContainer}>
            <Button title="Back" onPress={onBack} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  centerText: {
    color: '#fff',
    fontSize: 16,
    padding: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
});

export default QRCodeScreen;