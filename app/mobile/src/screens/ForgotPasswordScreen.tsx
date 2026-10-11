import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation.types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;

export default function ForgotPasswordScreen({
  navigation,
}: Props) {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const scrollFormIntoView = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 250);
  };

  const handleRecovery = () => {
    Keyboard.dismiss();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Email is required.');
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage(
        'Please enter a valid email address.'
      );
      return;
    }

    setErrorMessage('');

    /*
     * FUTURE BACKEND STEP:
     *
     * Send the email to Wesley's password
     * recovery API.
     *
     * After the backend accepts the request,
     * show a privacy-safe message such as:
     *
     * "If an account exists for this email,
     * password recovery instructions have
     * been sent."
     *
     * Do NOT show:
     * "This email is not registered."
     */
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios'
              ? 'interactive'
              : 'on-drag'
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>S</Text>
            </View>

            <Text style={styles.brandName}>
              Summit
            </Text>
          </View>

          <Text style={styles.title}>
            Forgot Password
          </Text>

          <Text style={styles.subtitle}>
            Enter the email associated with your
            account and we will send password
            recovery instructions.
          </Text>

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={[
              styles.input,
              errorMessage
                ? styles.inputError
                : null,
            ]}
            placeholder="Enter your email"
            placeholderTextColor="#777777"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="done"
            onFocus={scrollFormIntoView}
            onSubmitEditing={handleRecovery}
          />

          {errorMessage !== '' && (
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          )}

          <Pressable
            style={styles.button}
            onPress={handleRecovery}
          >
            <Text style={styles.buttonText}>
              Send Recovery Instructions
            </Text>
          </Pressable>

          <Pressable
            style={styles.backToLoginButton}
            onPress={() =>
              navigation.navigate('Login')
            }
            accessibilityRole="button"
          >
            <Text style={styles.backToLoginText}>
              Back to Login
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },

  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },

  brandContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  logoBox: {
    width: 38,
    height: 38,
    backgroundColor: '#e7c86e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  logoText: {
    color: '#111111',
    fontSize: 20,
    fontWeight: 'bold',
  },

  brandName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '600',
  },

  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#999999',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 32,
  },

  label: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#19191c',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },

  inputError: {
    borderColor: '#d96565',
  },

  errorText: {
    color: '#ff9f9f',
    fontSize: 13,
    marginBottom: 14,
  },

  button: {
    backgroundColor: '#e7c86e',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },

  backToLoginButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },

  backToLoginText: {
    color: '#e7c86e',
    fontSize: 14,
    fontWeight: '600',
  },
});