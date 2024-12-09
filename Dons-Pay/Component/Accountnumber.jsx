import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AccountNumber = ({ route, navigation }) => {
  const { amount, phoneNumber } = route.params;
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [senderDetails, setSenderDetails] = useState(null);

  useEffect(() => {
    if (enteredPhoneNumber.length === 12) {
      fetchData(enteredPhoneNumber);
    }
  }, [enteredPhoneNumber]);

  useEffect(() => {
    fetchSenderDetails(phoneNumber);
  }, [phoneNumber]);

  const handlePhoneNumberChange = (value) => {
    const formattedValue = value.replace(/[^0-9-]/g, '');

    if (formattedValue.length <= 12) {
      const formattedPhoneNumber = formattedValue.replace(/-/g, '');

      if (formattedPhoneNumber.length > 4) {
        const part1 = formattedPhoneNumber.slice(0, 4);
        const part2 = formattedPhoneNumber.slice(4, 12);
        setEnteredPhoneNumber(`${part1}-${part2}`);
      } else {
        setEnteredPhoneNumber(formattedPhoneNumber);
      }
      if (formattedPhoneNumber.length < 11) {
        setUserDetails(null);
      }
    }
  };

  const fetchData = (phoneNumber) => {
    database()
      .ref('Users Data ')
      .orderByChild('Phone')
      .equalTo(phoneNumber)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(userSnapshot => {
            const userData = userSnapshot.val();
            const firstName = userData['Fname'];
            const lastName = userData['Lname'];

            setUserDetails({ firstName, lastName });
          });
        } else {
          setUserDetails(null);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchSenderDetails = (phoneNumber) => {
    database()
      .ref('Users Data ')
      .orderByChild('Phone')
      .equalTo(phoneNumber)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(userSnapshot => {
            const userData = userSnapshot.val();
            const firstName = userData['Fname'];
            const lastName = userData['Lname'];
            setSenderDetails({ firstName, lastName });
          });
        }
      })
      .catch(error => {
        console.error('Error fetching sender data:', error);
      });
  };

  const handleContinue = () => {
    if (!userDetails) {
      Alert.alert('Error', 'No user found.');
      setEnteredPhoneNumber('');
      return;
    }

    if (enteredPhoneNumber === phoneNumber) {
      Alert.alert('Error', 'You cannot send money to your own account.');
      return;
    }

    const senderFullName = senderDetails ? `${senderDetails.firstName} ${senderDetails.lastName}` : 'Unknown Sender';
    const receiverFullName = userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Unknown Receiver';

    // Deduct amount from sender's phone number
    database()
      .ref('Users Data ')
      .orderByChild('Phone')
      .equalTo(phoneNumber)
      .once('value')
      .then(senderSnapshot => {
        if (senderSnapshot.exists()) {
          senderSnapshot.forEach(senderUserSnapshot => {
            const senderUserData = senderUserSnapshot.val();
            const senderBalance = senderUserData['Balance'];
            const updatedSenderBalance = parseFloat(senderBalance) - parseFloat(amount);
            senderUserSnapshot.ref.update({ Balance: updatedSenderBalance });
          });
        }
      })
      .catch(error => {
        console.error('Error deducting amount from sender:', error);
      });

    // Add amount to receiver's phone number
    database()
      .ref('Users Data ')
      .orderByChild('Phone')
      .equalTo(enteredPhoneNumber)
      .once('value')
      .then(receiverSnapshot => {
        if (receiverSnapshot.exists()) {
          receiverSnapshot.forEach(receiverUserSnapshot => {
            const receiverUserData = receiverUserSnapshot.val();
            const receiverBalance = receiverUserData['Balance'];
            const updatedReceiverBalance = parseFloat(receiverBalance) + parseFloat(amount);
            receiverUserSnapshot.ref.update({ Balance: updatedReceiverBalance });
          });
        }
      })
      .catch(error => {
        console.error('Error adding amount to receiver:', error);
      });

    // Add transaction to history
    database()
      .ref('Transaction History')
      .push({
        senderPhoneNumber: phoneNumber,
        receiverPhoneNumber: enteredPhoneNumber,
        senderName: senderFullName,
        receiverName: receiverFullName,
        amount: parseFloat(amount),
        timestamp: database.ServerValue.TIMESTAMP,
      })
      .catch(error => {
        console.error('Error adding transaction to history:', error);
      });

    // Log and navigate to the next screen or perform other actions
    console.log('Continue button pressed');
    console.log('Entered Amount:', amount);
    console.log('Phone Number:', enteredPhoneNumber);
    navigation.navigate('Fourth', { phoneNumber });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Send Money</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={enteredPhoneNumber}
            onChangeText={handlePhoneNumberChange}
            maxLength={12}
          />
          {userDetails && (
            <View style={styles.userDetailsContainer}>
              <TextInput
                style={styles.userDetailsText}
                value={`${userDetails.firstName} ${userDetails.lastName}`}
                editable={false}
              />
            </View>
          )}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Send Money</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  userDetailsContainer: {
    marginTop: 10,
  },
  userDetailsText: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#000',
  },
  button: {
    width: '100%',
    backgroundColor: '#FF7B66',
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default AccountNumber;
