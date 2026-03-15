import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SearchBar } from '../../components/SearchBar';

export default function SearchScreen() {
  const router = useRouter();

  const handleSearch = (login: string) => {
    router.push(`/(tabs)/profile/${encodeURIComponent(login)}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 justify-between py-8">
        {/* Logo/Title Section */}
        <View className="items-center gap-4">
          <View className="w-20 h-20 bg-indigo-500 rounded-full justify-center items-center">
            <Text className="text-3xl">🚀</Text>
          </View>
          <Text className="text-white text-3xl font-bold">
            Swifty Companion
          </Text>
          <Text className="text-zinc-400 text-center px-4">
            Search for 42 School students and view their profiles
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
      </View>
    </SafeAreaView>
  );
}
