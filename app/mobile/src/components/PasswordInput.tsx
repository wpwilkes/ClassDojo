import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

type PasswordInputProps = Omit<
  TextInputProps,
  'secureTextEntry'
> & {
  hasError?: boolean;
};

const PasswordInput = forwardRef<
  TextInput,
  PasswordInputProps
>(({ hasError = false, ...textInputProps }, ref) => {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <View
      style={[
        styles.container,
        hasError ? styles.errorBorder : null,
      ]}
    >
      <TextInput
        ref={ref}
        style={styles.input}
        placeholderTextColor="#777777"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        {...textInputProps}
      />

      <Pressable
        style={styles.showButton}
        onPress={() =>
          setShowPassword(
            (currentValue) => !currentValue
          )
        }
        accessibilityRole="button"
        accessibilityLabel={
          showPassword
            ? 'Hide password'
            : 'Show password'
        }
      >
        <Text style={styles.showButtonText}>
          {showPassword ? 'Hide' : 'Show'}
        </Text>
      </Pressable>
    </View>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19191c',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    marginBottom: 8,
  },

  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  showButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  showButtonText: {
    color: '#e7c86e',
    fontSize: 13,
    fontWeight: '600',
  },

  errorBorder: {
    borderColor: '#d96565',
  },
});