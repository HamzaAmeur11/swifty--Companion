import React from 'react';
import { View, Text, Image } from 'react-native';
import { User } from '../types';

interface UserCardProps {
  user: User;
  level: number;
}

export function UserCard({ user, level }: UserCardProps) {
  return (
    <View className="bg-zinc-900 rounded-lg p-4 gap-4 mb-4">
      {/* Avatar and Basic Info */}
      <View className="flex-row gap-4 items-center">
        <Image
          source={{ uri: user.image.link }}
          className="w-16 h-16 rounded-full bg-zinc-800"
          defaultSource={require('../assets/icon.png')}
        />
        <View className="flex-1 gap-1">
          <Text className="text-white font-bold text-lg">
            {user.displayname}
          </Text>
          <Text className="text-zinc-400">{user.login}</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-zinc-800" />

      {/* Contact Info */}
      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-zinc-400">Email</Text>
          <Text className="text-white flex-shrink">{user.email}</Text>
        </View>
        {user.phone && (
          <View className="flex-row justify-between">
            <Text className="text-zinc-400">Phone</Text>
            <Text className="text-white">{user.phone}</Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View className="h-px bg-zinc-800" />

      {/* Stats */}
      <View className="flex-row justify-between gap-4">
        <View className="flex-1">
          <Text className="text-zinc-400 text-sm">Level</Text>
          <Text className="text-indigo-400 font-bold text-lg">
            {level.toFixed(2)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-zinc-400 text-sm">Wallet</Text>
          <Text className="text-green-400 font-bold text-lg">₿ {user.wallet}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-zinc-400 text-sm">Points</Text>
          <Text className="text-orange-400 font-bold text-lg">
            {user.correction_point}
          </Text>
        </View>
      </View>

      {/* Location */}
      {user.location && (
        <>
          <View className="h-px bg-zinc-800" />
          <View>
            <Text className="text-zinc-400 text-sm">Location</Text>
            <Text className="text-white">{user.location}</Text>
          </View>
        </>
      )}
    </View>
  );
}
