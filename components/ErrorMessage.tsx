import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  message: string;
  onRetry?: () => void;
}

const ERROR_LABELS: Record<string, string> = {
  USER_NOT_FOUND: 'User not found. Check the login and try again.',
  NETWORK_ERROR: 'No network connection. Please check your internet.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHENTICATED: 'You are not logged in.',
};

export default function ErrorMessage({ message, onRetry }: Props) {
  const label = ERROR_LABELS[message] ?? message;

  return (
    <View className="items-center justify-center px-8 py-10 gap-4">
      <Text className="text-4xl">⚠️</Text>
      <Text className="text-zinc-300 text-base text-center">{label}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-indigo-500 rounded-xl px-6 py-3 active:opacity-70"
        >
          <Text className="text-white font-semibold">Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
