import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRCodeScreen = () => {
  const onSuccess = (e) => {
    alert(`QR Code Scanned! Data: ${e.data}`);
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner onRead={onSuccess} />
      <Text style={styles.instructions}>Point the camera at a QR code</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  instructions: { marginTop: 20, fontSize: 18 },
});

export default QRCodeScreen;