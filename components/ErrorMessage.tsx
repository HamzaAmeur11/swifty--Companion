import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View className="flex-1 bg-zinc-950 justify-center items-center px-4 gap-4">
      <Text className="text-6xl">⚠️</Text>
      <Text className="text-white text-center text-lg">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          className="bg-indigo-500 px-6 py-3 rounded-lg mt-4"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
