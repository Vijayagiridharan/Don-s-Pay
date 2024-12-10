import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';

const ProfileScreen = ({ route }) => {
  const { phoneNumber, token } = route.params;
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://10.0.0.6:8080/api/user/profile', {
        params: { phoneNumber },
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        'http://10.0.0.6:8080/api/user/profile',
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Edit Profile</Title>
          <Paragraph>Update your personal details below:</Paragraph>
        </Card.Content>
      </Card>
      <TextInput
        label="First Name"
        value={profile.firstName}
        onChangeText={(text) => setProfile({ ...profile, firstName: text })}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={profile.lastName}
        onChangeText={(text) => setProfile({ ...profile, lastName: text })}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        style={styles.input}
      />
      <TextInput
        label="Phone Number"
        value={profile.phoneNumber}
        editable={false}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={updateProfile}
        style={styles.updateButton}>
        Update Profile
      </Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  card: {
    marginBottom: 20,
    elevation: 3,
  },
  input: {
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: '#6200EE',
  },
});
