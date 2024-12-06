import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  Registration: undefined;
  RegistrationSuccess: undefined;
  Login: undefined;
  Landing: { name: string };
  Transactions: undefined;
  Wallet: undefined;
  Scanner: undefined;
};

export type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
export type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;
export type LandingScreenRouteProp = RouteProp<RootStackParamList, 'Landing'>;
export type ScannerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;