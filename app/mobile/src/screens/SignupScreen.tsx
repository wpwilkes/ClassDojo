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
import {
  SignupFormErrors,
  getEmailSuggestion,
  hasSignupErrors,
  validateSignupForm,
} from '../utils/authValidation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Signup'
>;

export default function SignupScreen({
  navigation,
}: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [errors, setErrors] =
    useState<SignupFormErrors>({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // References
  const scrollViewRef = useRef<ScrollView>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const emailSuggestion = getEmailSuggestion(email);

  // Scrolls the lower part of the form above the keyboard.
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 350);
  };

  const handleSignup = () => {
    Keyboard.dismiss();

    const validationErrors = validateSignupForm({
      username,
      email,
      password,
      confirmPassword,
    });

    setErrors(validationErrors);

    if (hasSignupErrors(validationErrors)) {
      return;
    }

    // Frontend validation passed.
    // Later:
    // Send registration information to backend API.
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);

    if (errors.username) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        username: undefined,
      }));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (errors.email) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: undefined,
      }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (
      errors.password ||
      errors.confirmPassword
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        password: undefined,
        confirmPassword: undefined,
      }));
    }
  };

  const handleConfirmPasswordChange = (
    value: string
  ) => {
    setConfirmPassword(value);

    if (errors.confirmPassword) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        confirmPassword: undefined,
      }));
    }
  };

  const useSuggestedEmail = () => {
    if (!emailSuggestion) {
      return;
    }

    setEmail(emailSuggestion);

    setErrors((currentErrors) => ({
      ...currentErrors,
      email: undefined,
    }));
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
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join the discussion.
          </Text>

          {/* Username */}

          <Text style={styles.label}>
            Username
          </Text>

          <TextInput
            style={[
              styles.input,
              errors.username
                ? styles.inputError
                : null,
            ]}
            placeholder="Choose a username"
            placeholderTextColor="#777777"
            value={username}
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() =>
              emailRef.current?.focus()
            }
          />

          {errors.username && (
            <Text style={styles.errorText}>
              {errors.username}
            </Text>
          )}

          {/* Email */}

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            ref={emailRef}
            style={[
              styles.input,
              errors.email
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
            returnKeyType="next"
            onSubmitEditing={() =>
              passwordRef.current?.focus()
            }
          />

          {errors.email && (
            <Text style={styles.errorText}>
              {errors.email}
            </Text>
          )}

          {emailSuggestion && (
            <View
              style={styles.suggestionContainer}
            >
              <Text
                style={styles.suggestionText}
              >
                Did you mean{' '}
                <Text
                  style={styles.suggestionLink}
                  onPress={useSuggestedEmail}
                >
                  {emailSuggestion}
                </Text>
                ?
              </Text>
            </View>
          )}

          {/* Password */}

          <Text style={styles.label}>
            Password
          </Text>

          <View
            style={[
              styles.passwordContainer,
              errors.password
                ? styles.inputError
                : null,
            ]}
          >
            <TextInput
              ref={passwordRef}
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#777777"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              returnKeyType="next"
              onFocus={scrollToBottom}
              onSubmitEditing={() => {
                confirmPasswordRef.current?.focus();
              }}
            />

            <Pressable
              style={styles.showButton}
              onPress={() =>
                setShowPassword(
                  (currentValue) =>
                    !currentValue
                )
              }
              accessibilityRole="button"
              accessibilityLabel={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              <Text
                style={styles.showButtonText}
              >
                {showPassword
                  ? 'Hide'
                  : 'Show'}
              </Text>
            </Pressable>
          </View>

          {errors.password && (
            <Text style={styles.errorText}>
              {errors.password}
            </Text>
          )}

          <Text style={styles.passwordHint}>
            Use at least 8 characters with
            uppercase, lowercase, a number, and
            a special character (! @ # $ % ^ & *).
          </Text>

          {/* Confirm Password */}

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View
            style={[
              styles.passwordContainer,
              errors.confirmPassword
                ? styles.inputError
                : null,
            ]}
          >
            <TextInput
              ref={confirmPasswordRef}
              style={styles.passwordInput}
              placeholder="Enter password again"
              placeholderTextColor="#777777"
              value={confirmPassword}
              onChangeText={
                handleConfirmPasswordChange
              }
              secureTextEntry={
                !showConfirmPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              returnKeyType="done"
              onFocus={scrollToBottom}
              onSubmitEditing={handleSignup}
            />

            <Pressable
              style={styles.showButton}
              onPress={() =>
                setShowConfirmPassword(
                  (currentValue) =>
                    !currentValue
                )
              }
              accessibilityRole="button"
              accessibilityLabel={
                showConfirmPassword
                  ? 'Hide confirmed password'
                  : 'Show confirmed password'
              }
            >
              <Text
                style={styles.showButtonText}
              >
                {showConfirmPassword
                  ? 'Hide'
                  : 'Show'}
              </Text>
            </Pressable>
          </View>

          {errors.confirmPassword && (
            <Text style={styles.errorText}>
              {errors.confirmPassword}
            </Text>
          )}

          {/* Sign Up Button */}

          <Pressable
            style={styles.button}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>
              Sign Up
            </Text>
          </Pressable>

          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text
              style={styles.loginLink}
              onPress={() =>
                navigation.navigate('Login')
              }
            >
              Log in
            </Text>
          </Text>
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
    paddingHorizontal: 24,
    paddingTop: 24,

    // Extra space is important.
    // It gives the screen enough room to scroll
    // the Confirm Password field above the keyboard.
    paddingBottom: 160,
  },

  brandContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
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
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
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

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19191c',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    marginBottom: 8,
  },

  passwordInput: {
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

  inputError: {
    borderColor: '#d96565',
  },

  errorText: {
    color: '#ff9f9f',
    fontSize: 13,
    marginBottom: 14,
  },

  suggestionContainer: {
    marginBottom: 14,
  },

  suggestionText: {
    color: '#aaaaaa',
    fontSize: 13,
  },

  suggestionLink: {
    color: '#e7c86e',
    fontWeight: '600',
  },

  passwordHint: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#e7c86e',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },

  loginText: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 10,
    fontSize: 14,
  },

  loginLink: {
    color: '#e7c86e',
    fontWeight: '600',
  },
});