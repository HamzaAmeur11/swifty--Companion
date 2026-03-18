import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Skill } from '../types';

interface Props {
  skill: Skill;
}

export default function SkillBar({ skill }: Props) {
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: skill.percentage,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [skill.percentage]);

  const widthInterpolated = animWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-zinc-300 text-sm" numberOfLines={1}>
          {skill.name}
        </Text>
        <Text className="text-zinc-400 text-xs">
          lvl {skill.level.toFixed(2)} · {Math.round(skill.percentage)}%
        </Text>
      </View>
      <View className="h-2 bg-zinc-700 rounded-full overflow-hidden">
        <Animated.View
          className="h-2 bg-indigo-500 rounded-full"
          style={{ width: widthInterpolated }}
        />
      </View>
    </View>
  );
}
