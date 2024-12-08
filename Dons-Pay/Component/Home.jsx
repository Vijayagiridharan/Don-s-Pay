import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ToastAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import QRCodeScanner from 'react-native-qrcode-scanner';

const SplitScreen = ({ route, navigation }) => {
  const { phoneNumber, token , refresh } = route.params;
  const [donDollarBalance, setDonDollarBalance] = useState(null);
  const [mealSwipes, setMealSwipes] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [backPressCount, setBackPressCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);



  useEffect(()=>{
    fetchBalance();
    fetchTransactions();

  },[phoneNumber])

  const fetchBalance = async () => {
    try {
      const response = await axios.get('http://10.0.0.6:8080/api/user/balance', {
        params: { phoneNumber },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonDollarBalance(response.data.donDollarsBalance || 0);
      setMealSwipes(response.data.mealSwipesBalance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setDonDollarBalance(0);
      setMealSwipes(0);
    }
  };

  useEffect(() => {
    if (route.params?.refresh) {
      // Re-fetch data when 'refresh' parameter exists
      fetchBalance();
      fetchTransactions();
  
      // Reset the refresh parameter
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://10.0.0.6:8080/api/user/transactions', {
        params: { phoneNumber },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data.reverse());
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  // Handle back press
  useEffect(() => {
    const backAction = () => {
      if (isScanning) {
        setIsScanning(false);
        return true;
      }

      if (navigation.isFocused()) {
        if (backPressCount === 1) {
          BackHandler.exitApp();
        } else {
          setBackPressCount(1);
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          setTimeout(() => setBackPressCount(0), 2000);
          return true;
        }
      } else {
        navigation.goBack();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation, backPressCount, isScanning]);

  // Save current screen
  useEffect(() => {
    const saveCurrentScreen = async () => {
      try {
        await AsyncStorage.setItem('lastScreen', JSON.stringify({ screen: 'Fourth', phoneNumber }));
      } catch (e) {
        console.error('Failed to save the current screen.', e);
      }
    };

    saveCurrentScreen();
  }, [phoneNumber]);

  // Render transaction item
  const renderTransactionItem = ({ item }) => {
    const isSentTransaction = item.type === 'DON_DOLLARS' || item.type === 'MEAL_SWIPES';
    const transactionName = item.type === 'DON_DOLLARS' ? 'Don Dollars' : 'Meal Swipes';
    const transactionAmount = `${isSentTransaction ? '-' : '+'} Rs. ${item.amount}`;

    return (
      <View style={styles.transactionContainer}>
        <Icon
          name={isSentTransaction ? 'arrow-up' : 'arrow-down'}
          size={30}
          color={isSentTransaction ? 'red' : 'green'}
          style={styles.transactionIcon}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{transactionName}</Text>
          <Text style={styles.transactionTime}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isSentTransaction ? 'red' : 'green' }]}>
          {transactionAmount}
        </Text>
      </View>
    );
  };

  // QR Code Scanner
  const ScanAndPay = () => {
    const onSuccess = (e) => {
      try {
        const merchantData = JSON.parse(e.data);
        console.log(merchantData); // Verify data in logs
        // Navigate to SendMoneyScreen, passing QR data as parameters
        navigation.navigate('Seventh', { qrData: merchantData, token, phoneNumber });
        setIsScanning(false); // Ensure scanner is reset after success
      } catch (error) {
        console.error('Invalid QR code data:', error);
        Alert.alert('Error', 'Invalid QR code format');
      }
    };

    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={onSuccess}
          topContent={
            <Text style={styles.scanText}>Position QR code within frame</Text>
          }
          bottomContent={
            <TouchableOpacity
              style={styles.buttonRectangle}
              onPress={() => setIsScanning(false)}
            >
              <Text style={styles.buttonText}>Cancel Scan</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  };

  if (isScanning) {
    return <ScanAndPay />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.upperScreen}>
        <TouchableOpacity style={styles.upperleft}>
          <Text style={styles.upperText}>Current Balance</Text>
          <Text style={styles.balanceText}>Don Dollars : {`$ ${donDollarBalance}`}</Text>
          <Text style={styles.balanceText}>Meal Swipes : {`${mealSwipes}`}</Text>
        </TouchableOpacity>
        <View style={styles.upperright}>
          <View style={styles.loadmoney}>
            <View style={{ margin: 10 }}>
              <Icon name="arrow-down" size={35} color="white" />
            </View>
            <Text style={styles.upperText}>Load</Text>
            <Text style={styles.lowertext}>Money</Text>
          </View>
          <TouchableOpacity
            style={styles.sendrequest}
            onPress={() => setIsScanning(true)}
          >
            <View style={{ margin: 10 }}>
              <Icon name="arrow-up" size={35} color="white" />
            </View>
            <Text style={styles.upperText}>Send &</Text>
            <Text style={styles.lowertext}>Request</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.lowerScreen}>
        <Text style={styles.title}>Today</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF3F9',
  },
  upperScreen: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
  upperleft: {
    flex: 1.3,
    backgroundColor: '#4FACFE',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardandarrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  upperText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 5,
  },
  balanceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 5,
  },
  upperright: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  loadmoney: {
    flex: 1,
    backgroundColor: '#6C63FF',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  sendrequest: {
    flex: 1,
    backgroundColor: '#FF5F7E',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  lowerScreen: {
    flex: 1,
    backgroundColor: '#EFF3F9',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
  },
  transactionTime: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 3,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default SplitScreen;
