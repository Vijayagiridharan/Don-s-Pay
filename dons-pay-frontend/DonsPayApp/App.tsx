import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import { BarCodeReadEvent } from 'react-native-camera'; 
import { Alert } from 'react-native';


// Type definitions
export type RootStackParamList = {
  Welcome: undefined;
  Registration: undefined;
  RegistrationSuccess: undefined;
  Login: undefined;
  Landing: { name: string };
  Transactions: undefined;
  Wallet: undefined;
  ScanAndPay: undefined;
  PaymentDetails: {
    merchantData: {
      name: string;
      account_number: string;
      id: string;
      number: string;
    };
  };
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>;
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;
type LandingScreenRouteProp = RouteProp<RootStackParamList, 'Landing'>;
type PaymentDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PaymentDetails'>;
  route: RouteProp<RootStackParamList, 'PaymentDetails'>;
};
type ScanAndPayScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScanAndPay'>;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

// Welcome Screen
const Welcome = ({ navigation }: { navigation: WelcomeScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DonsPay!</Text>
      <Image source={require('./assets/logo.jpg')} style={styles.logo} />
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

// Registration Screen
const Registration = ({ navigation }: { navigation: RegistrationScreenNavigationProp }) => {
  const [username, setUsername] = useState('');
  const [studentID, setStudentID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    navigation.navigate('RegistrationSuccess');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Student ID" value={studentID} onChangeText={setStudentID} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.buttonRectangle} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

// Registration Success Screen
const RegistrationSuccess = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'RegistrationSuccess'> }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Successful!</Text>
      <TouchableOpacity style={styles.buttonRectangle} onPress={() => navigation.navigate('Landing', { name: 'User' })}>
        <Text style={styles.buttonText}>Go To Homepage</Text>
      </TouchableOpacity>
    </View>
  );
};

// Login Screen
const Login = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('Landing', { name: username });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Login</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.buttonRectangle} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Landing Page
const Landing = ({ 
  navigation, 
  route 
}: { 
  navigation: LandingScreenNavigationProp;
  route: LandingScreenRouteProp;
}) => {
  const { name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}!</Text>
      <TouchableOpacity style={styles.buttonRectangle} onPress={() => navigation.navigate('Transactions')}>
        <Text style={styles.buttonText}>View Recent Transactions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonRectangle} onPress={() => navigation.navigate('Wallet')}>
        <Text style={styles.buttonText}>View Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonRectangle} onPress={() => navigation.navigate('ScanAndPay')}>
        <Text style={styles.buttonText}>Scan and Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

// Transactions Page
const Transactions = () => {
  const transactions = [
    { id: '1', description: 'Coffee', amount: '$3' },
    { id: '2', description: 'Bus Ticket', amount: '$2' },
    { id: '3', description: 'Book', amount: '$5' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.text}>{item.description}: {item.amount}</Text>}
      />
    </View>
  );
};

// Wallet Page
const Wallet = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Wallet Balance</Text>
    <Text style={styles.text}>Current Balance: $50</Text>
    <TouchableOpacity style={styles.buttonRectangle}>
      <Text style={styles.buttonText}>Recharge Wallet</Text>
    </TouchableOpacity>
  </View>
);
const ScanAndPay = ({ navigation }: ScanAndPayScreenProps) => {
  const [hasScanned, setHasScanned] = useState(false);

  const handleBarCodeScanned = ({ data } : BarCodeReadEvent) => {
    if (hasScanned) return; // Prevent multiple scans
    
    try {
      const merchantData = JSON.parse(data);
      setHasScanned(true);
      
      // Navigate to payment details screen
      navigation.replace('PaymentDetails', { merchantData });
    } catch (error) {
      console.error('Invalid QR code data:', error);
      Alert.alert('Error', 'Invalid QR code format');
      setHasScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={handleBarCodeScanned}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.scanText}>Position QR code within frame</Text>
        </View>
      </RNCamera>
    </View>
  );
};

const PaymentDetails = ({ route, navigation }: PaymentDetailsScreenProps) => {
  const { merchantData } = route.params;
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    // Add your payment processing logic here
    // For now, we'll just show a success message
    Alert.alert('Success', 'Payment processed successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('Landing', { name: 'User' }) }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.text}>Merchant: {merchantData.name}</Text>
        <Text style={styles.text}>Account: {merchantData.account_number}</Text>
        <Text style={styles.text}>Merchant ID: {merchantData.id}</Text>
        <Text style={styles.text}>Merchant Contact: {merchantData.number}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.buttonRectangle} onPress={handlePayment}>
          <Text style={styles.buttonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccess} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="ScanAndPay" component={ScanAndPay} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;

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