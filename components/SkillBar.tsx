import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { Skill } from '../types';

interface SkillBarProps {
  skill: Skill;
}

export function SkillBar({ skill }: SkillBarProps) {
  const [animatedWidth] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: skill.percentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [skill.percentage, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="gap-2 mb-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-medium flex-1">{skill.name}</Text>
        <Text className="text-indigo-400 font-semibold">
          {skill.level.toFixed(2)}
        </Text>
      </View>
      <View className="bg-zinc-800 rounded-full h-2 overflow-hidden">
        <Animated.View
          style={{ width: widthInterpolation }}
          className="bg-indigo-500 h-full rounded-full"
        />
      </View>
    </View>
  );
}
