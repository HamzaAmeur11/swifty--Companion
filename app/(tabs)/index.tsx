import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../hooks/useAuth';

export default function SearchScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth();

  function handleSearch(login: string) {
    if (!isAuthenticated) {
      signIn();
      return;
    }
    router.push(`/profile/${login}`);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 items-center justify-center gap-8">
        <View className="items-center gap-2">
          <Text className="text-white text-4xl font-bold tracking-tight">
            swifty
          </Text>
          <Text className="text-indigo-400 text-lg">companion</Text>
          <Text className="text-zinc-500 text-sm mt-1">
            Look up any 42 student
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#6366f1" size="large" />
        ) : !isAuthenticated ? (
          <View className="items-center gap-3 px-4">
            <Text className="text-zinc-400 text-sm text-center">
              Connect with your 42 account to search students
            </Text>
            <TouchableOpacity
              onPress={signIn}
              className="bg-indigo-500 rounded-xl px-8 py-3 active:opacity-70"
            >
              <Text className="text-white font-semibold text-base">
                Login with 42
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-full gap-4">
            <SearchBar onSearch={handleSearch} />
            <TouchableOpacity onPress={signOut} className="items-center">
              <Text className="text-zinc-600 text-xs">Sign out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
