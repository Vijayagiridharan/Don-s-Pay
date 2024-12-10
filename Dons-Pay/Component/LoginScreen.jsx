import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import ForgotPasswordModal from './ForgotPasswordModal';
ForgotPasswordModal

const Login = ({ route, navigation }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    phoneNumber: '',
    pin: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    studentId: '',
    newPassword: '',
  });
  

  // Shake animations for each input
  const shakeAnims = useRef({
    studentId: new Animated.Value(0),
    phoneNumber: new Animated.Value(0),
    pin: new Animated.Value(0),
  }).current;
  const modalShakeAnim = useRef(new Animated.Value(0)).current;

  // Modify the existing code to add modal opening function
  const handleForgotPassword = async (studentId, newPassword) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `https://don-s-pay.onrender.com/api/user/forgotPassword`,

        {
            studentId, // Ensure this matches the backend parameter name
            newPassword,
          },
      );
  
      showSnackbar('Password updated successfully.');
      setIsForgotPasswordModalVisible(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      showSnackbar(error.response?.data || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Modal Function
  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(true);
  };

  // Close Modal Function
  const handleCloseForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(false);
  };

  // Validation function
  const validateField = (name, value) => {
    switch (name) {
      case 'studentId':
        return /^\d{6,10}$/.test(value);
      case 'phoneNumber':
        return /^\d{10}$/.test(value);
      case 'pin':
        return value.length >= 6;
      default:
        return true;
    }
  };

  // Shake animation implementation
  const startShakeAnimation = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Handle input change without shaking
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update error state dynamically
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: !validateField(name, value),
      }));
    }
  };

  // Handle input blur (focus loss)
  const handleInputBlur = (name) => {
    if (!validateField(name, formData[name])) {
      setErrors((prev) => ({ ...prev, [name]: true }));
      startShakeAnimation(shakeAnims[name]);
    } else {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // Login handler with validation
  const handleLogin = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        newErrors[key] = true;
        startShakeAnimation(shakeAnims[key]);
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showSnackbar('Please correct the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://don-s-pay.onrender.com/api/auth/login', formData);
      const user = response.data;
      const token = response.data.token;

      if (user) {
        navigation.navigate('Fourth', { ...formData, token });
      } else {
        showSnackbar('User not found');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showSnackbar(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Snackbar utility
  const showSnackbar = (message) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#FF6347',
      textColor: '#FFFFFF',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('First')}>
          <Icon name="arrow-back" size={30} color="#4A00E0" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        

        {/* Input Fields */}
        {['studentId', 'phoneNumber', 'pin'].map((name, index) => {
          const placeholders = {
            studentId: 'Student ID',
            phoneNumber: 'Phone Number',
            pin: 'Password',
          };
          const icons = {
            studentId: 'card-outline',
            phoneNumber: 'call-outline',
            pin: 'lock-closed-outline',
          };
          return (
            <Animated.View
              key={index}
              style={[
                styles.inputContainer,
                { transform: [{ translateX: shakeAnims[name] }] },
              ]}
            >
              <View style={styles.inputWrapper}>
                <Icon
                  name={icons[name]}
                  size={20}
                  color={errors[name] ? '#FF6347' : '#4A00E0'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, errors[name] && styles.inputError]}
                  placeholder={placeholders[name]}
                  placeholderTextColor="#D3D3D3"
                  value={formData[name]}
                  onChangeText={(value) => handleInputChange(name, value)}
                  onBlur={() => handleInputBlur(name)}
                  secureTextEntry={name === 'pin'}
                  keyboardType={name === 'phoneNumber' ? 'phone-pad' : 'default'}
                />
              </View>
              {errors[name] && <Text style={styles.errorText}>Invalid {placeholders[name]}</Text>}
            </Animated.View>
          );
        })}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging In...' : 'Login'}
          </Text>
        </TouchableOpacity>

                {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={openForgotPasswordModal}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isVisible={isForgotPasswordModalVisible}
        onClose={handleCloseForgotPasswordModal}
        onSubmit={handleForgotPassword}
        shakeAnim={modalShakeAnim}
      />
        
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    color: '#4A00E0',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
    paddingRight: 20,
  },
  inputError: {
    borderColor: '#FF6347',
  },
  errorText: {
    color: '#FF6347',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20,
  },
  button: {
    backgroundColor: '#4A00E0',
    borderRadius: 25,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#4A00E0',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Login;
