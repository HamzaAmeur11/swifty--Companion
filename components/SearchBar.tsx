import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface Props {
  onSearch: (login: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <View className="flex-row items-center gap-2 w-full px-4">
      <TextInput
        className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-3 text-base border border-zinc-700"
        placeholder="Enter a 42 login..."
        placeholderTextColor="#71717a"
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-indigo-500 rounded-xl px-5 py-3 active:opacity-70"
      >
        <Text className="text-white font-semibold text-base">
          {loading ? '...' : 'Search'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
