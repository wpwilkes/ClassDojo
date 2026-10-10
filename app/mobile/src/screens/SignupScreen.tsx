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

import PasswordInput from '../components/PasswordInput';
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

  const scrollViewRef = useRef<ScrollView>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Stores the vertical positions of the password sections.
  const passwordPosition = useRef(0);
  const confirmPasswordPosition = useRef(0);

  const emailSuggestion = getEmailSuggestion(email);

  /*
   * Scroll only to the field that receives focus.
   * This prevents the screen from jumping all the way
   * to Confirm Password when Password is selected.
   */
  const scrollToField = (position: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(position - 80, 0),
        animated: true,
      });
    }, 250);
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

    /*
     * Frontend validation passed.
     *
     * FUTURE BACKEND STEP:
     * Send username, email, and password
     * to Wesley's registration API.
     *
     * After successful registration:
     *
     * navigation.navigate('EmailVerification', {
     *   email: email.trim(),
     * });
     */
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
          {/* Summit Brand */}

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

          <View
            onLayout={(event) => {
              passwordPosition.current =
                event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>
              Password
            </Text>

            <PasswordInput
              ref={passwordRef}
              hasError={Boolean(errors.password)}
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              autoComplete="new-password"
              returnKeyType="next"
              onFocus={() =>
                scrollToField(
                  passwordPosition.current
                )
              }
              onSubmitEditing={() =>
                confirmPasswordRef.current?.focus()
              }
            />

            {errors.password && (
              <Text style={styles.errorText}>
                {errors.password}
              </Text>
            )}

            <Text style={styles.passwordHint}>
              Use at least 8 characters with
              uppercase, lowercase, a number, and
              a special character
              (! @ # $ % ^ & *).
            </Text>
          </View>

          {/* Confirm Password */}

          <View
            onLayout={(event) => {
              confirmPasswordPosition.current =
                event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>
              Confirm Password
            </Text>

            <PasswordInput
              ref={confirmPasswordRef}
              hasError={Boolean(
                errors.confirmPassword
              )}
              placeholder="Enter password again"
              value={confirmPassword}
              onChangeText={
                handleConfirmPasswordChange
              }
              autoComplete="new-password"
              returnKeyType="done"
              onFocus={() =>
                scrollToField(
                  confirmPasswordPosition.current
                )
              }
              onSubmitEditing={handleSignup}
            />

            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Sign Up */}

          <Pressable
            style={styles.button}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>
              Sign Up
            </Text>
          </Pressable>

          {/* =====================================================
              TEMPORARY DEVELOPMENT TEST ONLY

              PURPOSE:
              Opens EmailVerificationScreen before Wesley's
              registration API is available.

              REMOVE THIS ENTIRE __DEV__ BLOCK after the real
              signup API is connected and successful registration
              automatically navigates to EmailVerification.

              Search this file later for:
              "TEMPORARY DEVELOPMENT TEST"
             ===================================================== */}
          {__DEV__ && (
            <Pressable
              style={styles.devTestButton}
              onPress={() =>
                navigation.navigate(
                  'EmailVerification',
                  {
                    email:
                      email.trim() ||
                      'test@example.com',
                  }
                )
              }
            >
              <Text
                style={styles.devTestButtonText}
              >
                DEV: Test Email Verification
              </Text>
            </Pressable>
          )}
          {/* END TEMPORARY DEVELOPMENT TEST */}

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
    paddingBottom: 120,
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

  // =========================================================
  // TEMPORARY DEVELOPMENT TEST STYLES
  //
  // REMOVE these two styles when the real signup API
  // replaces the temporary Email Verification test button.
  //
  // Search this file later for:
  // "TEMPORARY DEVELOPMENT TEST"
  // =========================================================

  devTestButton: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },

  devTestButtonText: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '600',
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