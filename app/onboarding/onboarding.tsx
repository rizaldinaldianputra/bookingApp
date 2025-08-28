// app/auth/LoginScreen.tsx
import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  const handlePress = () => {
    router.replace('/onboarding/geststarted'); // ganti '/home' dengan route yang diinginkan
  };

  return (
    <ImageBackground
      source={require('../../assets/images/onboarding.png')} // ganti dengan file-mu
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.title}>Haven</Text>
        <Text style={styles.description}>
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has
          been the industry's
        </Text>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // opsional untuk overlay gelap
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 180,

    alignContent: 'flex-end',
  },
  welcome: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 40,
    width: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
