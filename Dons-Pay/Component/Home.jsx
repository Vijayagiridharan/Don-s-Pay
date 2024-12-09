import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  BackHandler,
  ToastAndroid,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import QRCodeScanner from 'react-native-qrcode-scanner';

const SplitScreen = ({ route, navigation }) => {
  const { phoneNumber, token, studentId } = route.params;
  const [donDollarBalance, setDonDollarBalance] = useState(0);
  const [mealSwipes, setMealSwipes] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [studentName, setStudentName] = useState('User');
  const [backPressCount, setBackPressCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const fadeAnim = new Animated.Value(0);
  

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentDetails();
    fetchBalance();
    fetchTransactions();
    startFadeIn();
  }, []);

  // Fade-in animation
  const startFadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Fetch student details
  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get('http://10.0.0.6:8080/api/user/getProfile', {
        params: { studentId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentName(response.data.firstName || 'User');
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // Fetch balance
  const fetchBalance = async () => {
    try {
      const response = await axios.get('http://10.0.0.6:8080/api/user/balance', {
        params: { phoneNumber },
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonDollarBalance(response.data.donDollarsBalance || 0);
      setMealSwipes(response.data.mealSwipesBalance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setDonDollarBalance(0);
      setMealSwipes(0);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://10.0.0.6:8080/api/user/transactions', {
        params: { phoneNumber },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data.reverse());
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('First');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Back press handler
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
  
  
  // Render transaction item
  const renderTransactionItem = ({ item }) => {
    const isExpense = item.amount > 0;  // Change logic here
    return (
      <View style={styles.transactionCard}>
        <Icon
          name={isExpense ? 'arrow-up-circle' : 'arrow-down-circle'}
          size={30}
          color={isExpense ? '#FF6F61' : '#6C63FF'}
          style={styles.transactionIcon}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{item.merchant.merchantName}</Text>
          <Text style={styles.transactionTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        <Text style={[
          styles.transactionAmount, 
          { color: isExpense ? '#FF6F61' : '#6C63FF' }
        ]}>
          {isExpense ? '-' : '+'}${Math.abs(item.amount)}
        </Text>
      </View>
    );
  };
  const ScanAndPay = () => {
    const onSuccess = (e) => {
      try {
        const merchantData = JSON.parse(e.data);
        console.log(merchantData); // Verify data in logs
        // Navigate to SendMoneyScreen, passing QR data as parameters
        navigation.navigate('Seventh', { qrData: merchantData, token, phoneNumber,studentId });
        setIsScanning(false); // Ensure scanner is reset after success
      } catch (error) {
        console.error('Invalid QR code data:', error);
        Alert.alert('Error', 'Invalid QR code format');
      }
    };

    return (
      <View style={styles.scannerContainer}>
        <QRCodeScanner
          onRead={onSuccess}
          topContent={
            <Text style={styles.scanText}>Position QR code within the frame</Text>
          }
          bottomContent={
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsScanning(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel Scan</Text>
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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Top Section with Gradient */}
      <LinearGradient 
        colors={['#6C63FF', '#7E85FF']} 
        style={styles.topSection}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerLeftContent}>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.userName}>{studentName}</Text>
          </View>
          <View style={styles.headerRightContent}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile', { studentId, token, phoneNumber })}
              style={styles.profileButton}
            >
              <Icon name="account" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="logout" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card with Privacy Option */}
        <View style={styles.balanceCard}>
          <TouchableOpacity 
            style={styles.balanceItem} 
            onPress={() => setShowBalance(!showBalance)}
          >
            <Text style={styles.balanceLabel}>Don $$</Text>
            <Text style={styles.balanceAmount}>
              {showBalance 
                ? `$${donDollarBalance.toFixed(2)}` 
                : '****'}
            </Text>
          </TouchableOpacity>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Meal Swipes</Text>
            <Text style={styles.balanceAmount}>
              {mealSwipes}
            </Text>
          </View>
        </View>

        {/* Quick Actions remain the same */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Eight', { studentId, token, phoneNumber })}
          >
            <Icon name="wallet-plus" size={24} color="#6C63FF" />
            <Text style={styles.quickActionText}>Load Money</Text>
          </TouchableOpacity>
          <TouchableOpacity 
  style={styles.quickActionButton}
  onPress={() => {
    console.log('Setting isScanning to true'); // Debug
    setIsScanning(true);
  }}
>
  <Icon name="qrcode-scan" size={24} color="#6C63FF" />
  <Text style={styles.quickActionText}>Scan & Pay</Text>
</TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Ninth', { phoneNumber, token })}
          >
            <Icon name="credit-card" size={24} color="#6C63FF" />
            <Text style={styles.quickActionText}>Send Money</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Transactions Section remains the same */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    color: '#FFF',
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6C63FF',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000', // Black background for better contrast
  },
  scanText: {
    fontSize: 18,
    color: '#FFF', // White text for visibility
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    marginLeft: 10,
    color: '#6C63FF',
    fontWeight: '600',
  },
  transactionsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#34495E',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scanText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 5,
  },
  quickActionText: {
    marginTop: 8,
    color: '#6C63FF',
    fontWeight: '600',
  },
  transactionIcon: {
    marginRight: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeftContent: {
    flex: 1,
  },
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    marginRight: 15,
  },
  logoutButton: {},
  quickActionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '30%',  // Ensure consistent width
  },
  quickActionText: {
    marginTop: 5,
    color: '#6C63FF',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SplitScreen;