import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useUser } from '../../../hooks/useUser';
import UserCard from '../../../components/UserCard';
import SkillBar from '../../../components/SkillBar';
import ProjectItem from '../../../components/ProjectItem';
import ErrorMessage from '../../../components/ErrorMessage';

export default function ProfileScreen() {
  const { login } = useLocalSearchParams<{ login: string }>();
  const router = useRouter();
  const { data: user, isLoading, isError, error, refetch } = useUser(login);

  const mainCursus =
    user?.cursus_users.find((c) => c.cursus.name === '42cursus') ??
    user?.cursus_users[user.cursus_users.length - 1];

  const skills = mainCursus?.skills ?? [];

  const finishedProjects =
    user?.projects_users.filter((p) => p.status === 'finished') ?? [];

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <Stack.Screen
        options={{
          title: login,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Text className="text-indigo-400 text-base">← Back</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6366f1" size="large" />
          <Text className="text-zinc-500 text-sm mt-3">
            Loading {login}...
          </Text>
        </View>
      )}

      {isError && (
        <View className="flex-1 items-center justify-center">
          <ErrorMessage
            message={error?.message ?? 'UNKNOWN'}
            onRetry={refetch}
          />
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-indigo-400">← Back to search</Text>
          </TouchableOpacity>
        </View>
      )}

      {user && (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 16, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <UserCard user={user} />

          {skills.length > 0 && (
            <View className="mx-4 bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
              <Text className="text-white font-semibold text-base mb-4">
                Skills
              </Text>
              {skills.map((skill) => (
                <SkillBar key={skill.id} skill={skill} />
              ))}
            </View>
          )}

          {finishedProjects.length > 0 && (
            <View className="mx-4 bg-zinc-900 rounded-2xl p-5 border border-zinc-800 mb-8">
              <Text className="text-white font-semibold text-base mb-3">
                Projects ({finishedProjects.length})
              </Text>
              {finishedProjects.map((p) => (
                <ProjectItem
                  key={p.project.id}
                  name={p.project.name}
                  passed={p.passed}
                  finalMark={p.final_mark}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
