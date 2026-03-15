import React from 'react';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 justify-center items-center px-4 gap-4">
        <Text className="text-6xl">404</Text>
        <Text className="text-white text-lg text-center">
          Page not found
        </Text>
        <Link href="/(tabs)" asChild>
          <TouchableOpacity className="bg-indigo-500 px-6 py-3 rounded-lg mt-4">
            <Text className="text-white font-semibold text-center">
              Go home
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
