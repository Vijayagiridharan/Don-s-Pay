import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

const CardScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [cardDetails, setCardDetails] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {

    
    const cardRef = database()
      .ref('Users Data ')
      .orderByChild('Phone')
      .equalTo(phoneNumber);

    const onValueChange = cardRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const user = Object.values(userData)[0];
        if (user.CardDetails) {
          setCardDetails(user.CardDetails);
          setIsFrozen(user.isFrozen);
        }
      }
    });

    return () => {
      cardRef.off('value', onValueChange);
    };
  }, [phoneNumber]);

  const handleActivateCard = async () => {
    if (cardDetails) {
      Alert.alert('Card Already Activated', 'Your card is already activated. Please find the details below.');
      return;
    }

    // Generate card details
    const cardNumber = generateCardNumber();
    const cvv = generateCVV();
    const expiry = generateExpiryDate();

    // Save card details to Firebase
    const cardRef = database().ref('Users Data ').orderByChild('Phone').equalTo(phoneNumber);
    try {
      await cardRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            childSnapshot.ref.update({ CardDetails: { cardNumber, cvv, expiry }, isFrozen: false });
            setCardDetails({ cardNumber, cvv, expiry });
            setIsFrozen(false);
          });
          Alert.alert('Card Activated', 'Your card has been successfully activated. Please find the details below.');
        }
      });
    } catch (error) {
      console.error('Error activating card:', error);
      Alert.alert('Error', 'Failed to activate your card. Please try again later.');
    }
  };

  const handleToggleFreeze = async () => {
    if (!cardDetails) {
      Alert.alert('Card Not Activated', 'Please activate your card first.');
      return;
    }

    const freezeStatus = !isFrozen;

    const cardRef = database().ref('Users Data').orderByChild('Phone').equalTo(phoneNumber);
    try {
      await cardRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            childSnapshot.ref.update({ isFrozen: freezeStatus });
            setIsFrozen(freezeStatus);
            Alert.alert(
              `Card ${freezeStatus ? 'Frozen' : 'Unfrozen'}`,
              `Your card has been ${freezeStatus ? 'frozen' : 'unfrozen'}.`
            );
          });
        }
      });
    } catch (error) {
      console.error('Error toggling freeze status:', error);
      Alert.alert('Error', 'Failed to toggle freeze status. Please try again later.');
    }
  };

  const handleCopyCardNumber = () => {
    if (cardDetails && cardDetails.cardNumber) {
      Clipboard.setString(cardDetails.cardNumber);
      Alert.alert('Card Number Copied', 'Your card number has been copied to the clipboard.');
    } else {
      Alert.alert('No Card Number', 'No card number to copy.');
    }
  };

  const generateCardNumber = () => {
    const cardNumber = [];
    for (let i = 0; i < 16; i++) {
      cardNumber.push(Math.floor(Math.random() * 10));
    }
    return cardNumber.join('');
  };

  const generateCVV = () => {
    return ('' + Math.floor(100 + Math.random() * 900)); // Ensure it's always 3 digits
  };

  const generateExpiryDate = () => {
    const now = new Date();
    const futureYear = now.getFullYear() + Math.floor(Math.random() * 5) + 1; // Between 1 and 5 years in the future
    const futureMonth = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2); // Ensure 2 digits for month
    return `${futureMonth}/${futureYear.toString().slice(-2)}`; // MM/YY format
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Details</Text>
      </View>
      <View style={styles.cardContainer}>
        {cardDetails ? (
          <View style={styles.card}>
            <Text style={styles.cardNumber}>{cardDetails.cardNumber}</Text>
            <View style={styles.cardDetailsContainer}>
              <Text style={styles.cardDetailText}>Exp date</Text>
              <Text style={styles.cardDetailText}>CVC</Text>
            </View>
            <View style={styles.cardDetailsContainer}>
              <Text style={styles.cardDetailText}>{cardDetails.expiry}</Text>
              <Text style={styles.cardDetailText}>{cardDetails.cvv}</Text>
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Freeze card</Text>
              <Switch
                value={isFrozen}
                onValueChange={handleToggleFreeze}
              />
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCardNumber}>
              <Icon name="copy-outline" size={20} color="#000" />
              <Text style={styles.copyButtonText}>Copy Card Number</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            direction="alternate"
            style={styles.animationContainer}
          >
            <TouchableOpacity style={styles.activateButton} onPress={handleActivateCard}>
              <Text style={styles.activateText}>Activate Your Card</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: 250,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'space-between'
  },
  cardNumber: {
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardDetailText: {
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center'
  },
  copyButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000'
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activateButton: {
    backgroundColor: '#01D2AF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  activateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CardScreen;
