// App.tsx
import React, { useState, useCallback } from 'react';
import QRCodeScreen from './QRCodeScanner';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [showScanner, setShowScanner] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleScanner = useCallback(() => {
    setShowScanner(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={[backgroundStyle, styles.safeArea]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {showScanner ? (
        <QRCodeScreen onBack={toggleScanner} />
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View
            style={[
              styles.mainContainer,
              {
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
              },
            ]}>
            <Text style={styles.title}>Welcome to the QR Code App</Text>
            <Text style={styles.description}>
              Tap the button below to open the QR code scanner.
            </Text>
            <Button title="Open QR Scanner" onPress={toggleScanner} />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: Colors.primary,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default App;