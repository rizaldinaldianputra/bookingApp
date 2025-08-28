import CustomButton from '@/components/ui/button';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let’s you in</Text>

      {/* Google Button */}
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#fff' }]}>
        <Image source={require('../../assets/images/google.png')} style={styles.icon} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Facebook Button */}
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#fff' }]}>
        <Image source={require('../../assets/images/facebook.png')} style={styles.icon} />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#fff' }]}>
        <Image source={require('../../assets/images/apple.png')} style={styles.icon} />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separatorLine} />
      </View>

      <View>
        <CustomButton onPress={() => router.replace('/auth/login')} title="Sign in with Password" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center', // menengahkan semua konten
    backgroundColor: '#f9fafb',
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 44,
    fontWeight: '500',
    fontStyle: 'normal',
    alignContent: 'center',
    color: '#000000',
    marginBottom: 80,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // icon & text tetap di tengah
    padding: 14,
    borderRadius: 8,
    marginVertical: 6,
    marginBottom: 10,
    borderColor: '#d1d5db',
    width: '100%', // tombol full width
  },
  socialText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    color: '#484C52',
    marginLeft: 8, // jarak icon & text
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  separatorText: {
    marginHorizontal: 12,
    color: '#6b7280',
  },
  passwordButton: {
    backgroundColor: '#064e3b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
