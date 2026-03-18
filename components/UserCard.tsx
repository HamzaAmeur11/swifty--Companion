import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { User } from '../types';

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
  const mainCursus =
    user.cursus_users.find((c) => c.cursus.name === '42cursus') ??
    user.cursus_users[user.cursus_users.length - 1];

  const level = mainCursus?.level ?? 0;
  const levelInt = Math.floor(level);
  const levelPct = Math.round((level - levelInt) * 100);

  return (
    <View className="bg-zinc-900 rounded-2xl p-5 mx-4 border border-zinc-800">
      <View className="items-center mb-4">
        <Image
          source={{ uri: user.image?.link }}
          style={{ width: 96, height: 96, borderRadius: 48 }}
          placeholder={{ uri: 'https://via.placeholder.com/96' }}
          contentFit="cover"
          transition={300}
        />
        <Text className="text-white text-xl font-semibold mt-3">
          {user.displayname}
        </Text>
        <Text className="text-zinc-400 text-sm">@{user.login}</Text>
      </View>

      <View className="bg-zinc-800 rounded-xl px-3 py-2 mb-3">
        <Text className="text-zinc-400 text-xs mb-1">
          Level {levelInt} — {levelPct}%
        </Text>
        <View className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <View
            className="h-2 bg-indigo-500 rounded-full"
            style={{ width: `${levelPct}%` }}
          />
        </View>
      </View>

      <View className="gap-2">
        <Row label="Email" value={user.email} />
        <Row label="Phone" value={user.phone || 'hidden'} />
        <Row label="Location" value={user.location ?? 'unavailable'} />
        <Row label="Wallet" value={`${user.wallet} ₳`} />
        <Row label="Evaluations" value={`${user.correction_point} pts`} />
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-zinc-400 text-sm">{label}</Text>
      <Text className="text-white text-sm font-medium">{value}</Text>
    </View>
  );
}
