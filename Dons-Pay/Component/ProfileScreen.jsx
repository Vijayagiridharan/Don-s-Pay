import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Switch,
  TextInput,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({ route, navigation }) => {
  const { phoneNumber, token, studentId } = route.params;
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profilePicture: null
  });
  const [profileImage, setProfileImage] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true
  });

  useEffect(() => {
    fetchProfile();
    loadProfileImage();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('https://don-s-pay.onrender.com/api/user/getProfile', {
        params: { studentId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile details');
    }
  };

  const updateProfile = async () => {
    try {
      const updateData = {
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        profilePictureUrl: profileImage, // Send profile image URL or base64 string
      };
  
      await axios.put(
        'https://don-s-pay.onrender.com/api/user/updateProfile',
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };
  

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };

  const selectProfileImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image');
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        setProfileImage(source);
      }
    });
  };

  const toggleNotificationSetting = (setting) => {
    setNotificationSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting]
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#6C63FF', '#7E85FF']} style={styles.topSection}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>My Profile</Text>
        </View>

        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={selectProfileImage}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Icon name="camera-plus" size={30} color="#6C63FF" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.profileDetailsContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color="#6C63FF" style={styles.inputIcon} />
            <TextInput
              value={profile.firstName}
              onChangeText={(text) => setProfile({ ...profile, firstName: text })}
              style={styles.input}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color="#6C63FF" style={styles.inputIcon} />
            <TextInput
              value={profile.lastName}
              onChangeText={(text) => setProfile({ ...profile, lastName: text })}
              style={styles.input}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#6C63FF" style={styles.inputIcon} />
            <TextInput
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              style={styles.input}
              keyboardType="email-address"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#6C63FF" style={styles.inputIcon} />
            <TextInput
              value={profile.phoneNumber}
              editable={false}
              style={[styles.input, styles.disabledInput]}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <View style={styles.notificationItem}>
            <Icon name="email-newsletter" size={20} color="#6C63FF" />
            <Text style={styles.notificationText}>Email Notifications</Text>
            <Switch
              value={notificationSettings.emailNotifications}
              onValueChange={() => toggleNotificationSetting('emailNotifications')}
              trackColor={{ false: "#767577", true: "#6C63FF" }}
              thumbColor={notificationSettings.emailNotifications ? "#FFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.notificationItem}>
            <Icon name="bell" size={20} color="#6C63FF" />
            <Text style={styles.notificationText}>Push Notifications</Text>
            <Switch
              value={notificationSettings.pushNotifications}
              onValueChange={() => toggleNotificationSetting('pushNotifications')}
              trackColor={{ false: "#767577", true: "#6C63FF" }}
              thumbColor={notificationSettings.pushNotifications ? "#FFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.notificationItem}>
            <Icon name="cash" size={20} color="#6C63FF" />
            <Text style={styles.notificationText}>Transaction Alerts</Text>
            <Switch
              value={notificationSettings.transactionAlerts}
              onValueChange={() => toggleNotificationSetting('transactionAlerts')}
              trackColor={{ false: "#767577", true: "#6C63FF" }}
              thumbColor={notificationSettings.transactionAlerts ? "#FFF" : "#f4f3f4"}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={updateProfile}
        >
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  screenTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileEmail: {
    color: '#F0F0F0',
    fontSize: 16,
  },
  profileDetailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#34495E',
    marginBottom: 5,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#34495E',
  },
  disabledInput: {
    color: '#A0A0A0',
  },
  notificationSection: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  notificationText: {
    flex: 1,
    marginLeft: 10,
    color: '#34495E',
  },
  updateButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;