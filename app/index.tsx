/**
 * app/index.tsx — Search Screen
 */

import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { getUserByLogin } from '../services/api';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async () => {
    const login = query.trim().toLowerCase();
    if (!login) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const user = await getUserByLogin(login);
      router.push({ pathname: '/profile', params: { data: JSON.stringify(user) } });
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      if (msg === 'USER_NOT_FOUND') Alert.alert('Not Found', `No user found for "${login}".`);
      else if (msg === 'RATE_LIMITED') Alert.alert('Rate Limited', 'Too many requests. Wait a moment.');
      else Alert.alert('Error', msg || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>⬡</Text>
        <Text style={styles.heading}>swifty</Text>
        <Text style={styles.sub}>Search any 42 student by login</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="jdoe"
            placeholderTextColor="#333"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.searchBtn, (!query.trim() || loading) && styles.disabled]}
            onPress={search}
            disabled={!query.trim() || loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#0a0a0f" size="small" />
              : <Text style={styles.searchBtnText}>Go</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  inner: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 52, color: '#00BABC', marginBottom: 8 },
  heading: { fontSize: 38, fontWeight: '800', color: '#fff', letterSpacing: -1, marginBottom: 6 },
  sub: { fontSize: 15, color: '#555', marginBottom: 36 },
  inputRow: { flexDirection: 'row', width: '100%', gap: 10 },
  input: {
    flex: 1, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1e1e2e',
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
    color: '#fff', fontSize: 16, fontFamily: 'monospace',
  },
  searchBtn: {
    backgroundColor: '#00BABC', borderRadius: 12,
    paddingHorizontal: 22, justifyContent: 'center', alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
  searchBtnText: { color: '#0a0a0f', fontWeight: '800', fontSize: 16 },
});
