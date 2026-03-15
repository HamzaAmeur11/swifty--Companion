import React from 'react';
import { View, Text } from 'react-native';

interface ProjectItemProps {
  name: string;
  passed: boolean | null;
  mark: number | null;
}

export function ProjectItem({ name, passed, mark }: ProjectItemProps) {
  const badgeColor = passed ? 'bg-green-900/50 border-green-600' : 'bg-red-900/50 border-red-600';
  const badgeTextColor = passed ? 'text-green-400' : 'text-red-400';
  const badgeLabel = passed ? 'PASS' : 'FAIL';

  return (
    <View className="flex-row justify-between items-center bg-zinc-900 p-3 rounded-lg mb-2">
      <Text className="text-white flex-1" numberOfLines={1}>
        {name}
      </Text>
      <View className="flex-row gap-2 items-center">
        {mark !== null && (
          <Text className="text-zinc-400 text-sm">{mark}%</Text>
        )}
        <View className={`px-3 py-1 rounded border ${badgeColor}`}>
          <Text className={`text-xs font-bold ${badgeTextColor}`}>
            {badgeLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
