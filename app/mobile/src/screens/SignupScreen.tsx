import { useState } from 'react';
import {
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

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>S</Text>
            </View>

            <Text style={styles.brandName}>Summit</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>Join the discussion.</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor="#777777"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#777777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#777777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password again"
            placeholderTextColor="#777777"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>

          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log in</Text>
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
    paddingBottom: 40,
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
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#e7c86e',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
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