import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const WelcomeScreen = ({ navigation }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "To DonsPay, One-stop for all your campus payments.";
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    let typingInterval;
    let currentIndex = 0;

    // Start typing animation
    typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(prev => prev + fullText[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    // Fade in animation for buttons
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: fullText.length * 50, // Delay until typing is complete
      useNativeDriver: true,
    }).start();

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <LinearGradient
      colors={['#8E2DE2', '#4A00E0']}
      style={styles.container}
    >
      {/* Logo with subtle animation */}
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            transform: [
              { 
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                }) 
              }
            ]
          }
        ]}
      >
        <Image
          source={require('../assets/logo.jpg')}
          style={styles.logo}
        />
      </Animated.View>

      {/* Welcome Text with Typing Effect */}
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subText}>{typedText}</Text>
      </View>

      {/* Animated Buttons */}
      <Animated.View 
        style={[
          styles.buttonContainer, 
          { 
            opacity: fadeAnim,
            transform: [
              { 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                }) 
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Fifth')}
        >
          <Icon name="log-in-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.navigate('Second')}
        >
          <Icon name="person-add-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.outlineButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outlineButton: {
    borderColor: 'white',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default WelcomeScreen;