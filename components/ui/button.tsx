import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';

type CustomButtonProps = {
  onPress: () => void;
  title: string;
};

export default function CustomButton({ onPress, title }: CustomButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 348,
    height: 54,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    marginTop: 20,
  },
  buttonText: {
    width: 153,
    height: 22,
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    color: '#FFFFFF',
  },
});
