import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SearchBarProps {
  onSearch: (login: string) => void;
  disabled?: boolean;
}

export function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [login, setLogin] = useState('');

  const handleSubmit = () => {
    if (login.trim()) {
      onSearch(login.trim());
    }
  };

  return (
    <View className="flex-1 px-4 py-6 justify-center gap-4">
      <TextInput
        className="bg-zinc-800 text-white px-4 py-3 rounded-lg text-base placeholder-zinc-500"
        placeholder="Enter login"
        placeholderTextColor="#71717a"
        value={login}
        onChangeText={setLogin}
        onSubmitEditing={handleSubmit}
        editable={!disabled}
        returnKeyType="search"
      />
      <TouchableOpacity
        className={`${
          disabled ? 'bg-zinc-700' : 'bg-indigo-500'
        } py-3 px-4 rounded-lg`}
        onPress={handleSubmit}
        disabled={disabled || !login.trim()}
      >
        <Text className="text-white text-center font-semibold text-base">
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
}
