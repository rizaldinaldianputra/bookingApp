// components/ui/input.tsx
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  placeholder?: string;
};

export default function CustomInput({ placeholder, style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#FFFFFF"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderWidth: 0, // tanpa border
    backgroundColor: '#FFFFFF', // opsional, bisa dihapus kalau mau transparan
    borderRadius: 8, // opsional
  },
});
