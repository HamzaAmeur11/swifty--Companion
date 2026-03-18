import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  name: string;
  passed: boolean | null;
  finalMark: number | null;
}

export default function ProjectItem({ name, passed, finalMark }: Props) {
  const isPassed = passed === true;

  return (
    <View className="flex-row justify-between items-center py-2 border-b border-zinc-800">
      <Text className="text-zinc-300 text-sm flex-1 mr-2" numberOfLines={1}>
        {name}
      </Text>
      <View className="flex-row items-center gap-2">
        {finalMark !== null && (
          <Text className="text-zinc-500 text-xs">{finalMark}/100</Text>
        )}
        <View
          className={`px-2 py-0.5 rounded-full ${
            isPassed ? 'bg-green-900' : 'bg-red-900'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              isPassed ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPassed ? 'PASS' : 'FAIL'}
          </Text>
        </View>
      </View>
    </View>
  );
}
