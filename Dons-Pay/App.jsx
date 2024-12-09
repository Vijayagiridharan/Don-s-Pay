import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import SplitScreen from './Component/Home';
import Sign from './Component/Signup';
import Login from './Component/LoginScreen';
import UserVerification from './Component/Userverification';
import DonsPayLoginScreen from './Component/Mainhome';
import VirtualCardScreen from './Component/Cards';
import SendMoneyScreen from './Component/Sendmoney';
import LoadMoneyScreen from './Component/LoadMoneyScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('First');

  useEffect(() => {
    const loadInitialRoute = async () => {
      try {
        const lastScreen = await AsyncStorage.getItem('lastScreen');
        if (lastScreen) {
          const { screen, phoneNumber } = JSON.parse(lastScreen);
          setInitialRoute(screen);
        }
      } catch (e) {
        console.error('Failed to load the initial route.', e);
      } finally {
        SplashScreen.hide();
      }
    };

    loadInitialRoute();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="First"
          component={DonsPayLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Second"
          component={Sign}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Third"
          component={UserVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Fifth"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Fourth"
          component={SplitScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sixth"
          component={VirtualCardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Seventh"
          component={SendMoneyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Eight"
          component={LoadMoneyScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
