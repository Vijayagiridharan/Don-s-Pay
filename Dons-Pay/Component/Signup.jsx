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

const Sign = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    phoneNumber: '',
    email: '',
    pin: '',
    confirmPin: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shakeAnims = useRef(
    Object.keys(formData).reduce((acc, key) => {
      acc[key] = new Animated.Value(0);
      return acc;
    }, {})
  ).current;

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.length >= 2 && /^[A-Za-z]+$/.test(value);
      case 'studentId':
        return /^\d{6,10}$/.test(value);
      case 'phoneNumber':
        return /^\d{10}$/.test(value);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'pin':
        return value.length >= 6;
      case 'confirmPin':
        return value === formData.pin;
      default:
        return true;
    }
  };

  // Shake animation
  const startShakeAnimation = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only show errors after focus loss or submission
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

  // Submit handler
  const handleSubmit = async () => {
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

    setIsSubmitting(true);
    try {
      const response = await axios.post('https://don-s-pay.onrender.com/api/auth/register', {
        ...formData,
      });
      showSnackbar('Signup successful!');
      navigation.navigate('First', {
        studentId: formData.studentId,
        phoneNumber: formData.phoneNumber,
      });
    } catch (error) {
      console.error('Signup error:', error);
      showSnackbar(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  // Field configuration for rendering
  const fields = [
    { name: 'firstName', placeholder: 'First Name', icon: 'person-outline' },
    { name: 'lastName', placeholder: 'Last Name', icon: 'person-outline' },
    { name: 'studentId', placeholder: 'Student ID', icon: 'card-outline' },
     { name: 'phoneNumber', placeholder: 'Phone Number', icon: 'call-outline'  },
    { name: 'email', placeholder: 'Email', icon: 'mail-outline' },
    { name: 'pin', placeholder: 'Password', icon: 'lock-closed-outline', secureTextEntry: true },
    { name: 'confirmPin', placeholder: 'Confirm Password', icon: 'lock-closed-outline', secureTextEntry: true },
  ];

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
        <Text style={styles.title}>Create Your Account</Text>

        {/* Input Fields */}
        {fields.map((field) => (
          <Animated.View
            key={field.name}
            style={[
              styles.inputContainer,
              { transform: [{ translateX: shakeAnims[field.name] }] },
            ]}
          >
            <View style={styles.inputWrapper}>
              <Icon
                name={field.icon}
                size={20}
                color={errors[field.name] ? '#FF6347' : '#4A00E0'}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors[field.name] && styles.inputError]}
                placeholder={field.placeholder}
                placeholderTextColor="#D3D3D3"
                value={formData[field.name]}
                onChangeText={(value) => handleInputChange(field.name, value)}
                onBlur={() => handleInputBlur(field.name)}
                secureTextEntry={field.secureTextEntry || false}
              />
            </View>
            {errors[field.name] && (
              <Text style={styles.errorText}>Invalid {field.placeholder}</Text>
            )}
          </Animated.View>
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>
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
});

export default Sign;
