import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';

const ForgotPasswordModal = ({ 
  isVisible, 
  onClose, 
  shakeAnim 
}) => {
  const [forgotPasswordData, setForgotPasswordData] = useState({
    studentId: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateStudentId = (id) => /^\d{6,10}$/.test(id);
  const validatePassword = (password) => password.length >= 6;

  // Handle input changes
  const handleInputChange = (name, value) => {
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input validation
  const validateInput = () => {
    const newErrors = {};
    if (!validateStudentId(forgotPasswordData.studentId)) {
      newErrors.studentId = true;
    }
    if (!validatePassword(forgotPasswordData.newPassword)) {
      newErrors.newPassword = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // Handle forgot password submission
  const handleForgotPassword = async () => {
    if (!validateInput()) {
      return;
    }

    setIsLoading(true);
    try { 
      const { studentId, newPassword } = forgotPasswordData; 
      const response = await axios.put('https://don-s-pay.onrender.com/api/user/forgotPassword', 
      { 
        studentId, 
        newPassword, 
      }); 
      showSnackbar(response.data);
      setIsLoading(false);
      onClose(); 
    } catch (error) { 
      showSnackbar(error.response?.data || 'Password reset failed.'); 
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={25} color="#4A00E0" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Reset Password</Text>

          {/* Student ID Input */}
          <Animated.View 
            style={[
              styles.inputContainer, 
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            <View style={styles.inputWrapper}>
              <Icon
                name="card-outline"
                size={20}
                color={errors.studentId ? '#FF6347' : '#4A00E0'}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.studentId && styles.inputError]}
                placeholder="Student ID"
                placeholderTextColor="#D3D3D3"
                value={forgotPasswordData.studentId}
                onChangeText={(value) => handleInputChange('studentId', value)}
                keyboardType="numeric"
              />
            </View>
            {errors.studentId && (
              <Text style={styles.errorText}>Invalid Student ID</Text>
            )}
          </Animated.View>

          {/* New Password Input */}
          <Animated.View 
            style={[
              styles.inputContainer, 
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            <View style={styles.inputWrapper}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color={errors.newPassword ? '#FF6347' : '#4A00E0'}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.newPassword && styles.inputError]}
                placeholder="New Password"
                placeholderTextColor="#D3D3D3"
                value={forgotPasswordData.newPassword}
                onChangeText={(value) => handleInputChange('newPassword', value)}
                secureTextEntry
              />
            </View>
            {errors.newPassword && (
              <Text style={styles.errorText}>Password must be at least 6 characters</Text>
            )}
          </Animated.View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 24,
    color: '#4A00E0',
    fontWeight: 'bold',
    marginBottom: 20,
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

export default ForgotPasswordModal;