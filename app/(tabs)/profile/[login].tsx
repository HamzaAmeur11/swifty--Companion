import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '../../../hooks/useUser';
import { UserCard } from '../../../components/UserCard';
import { SkillBar } from '../../../components/SkillBar';
import { ProjectItem } from '../../../components/ProjectItem';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function ProfileScreen() {
  const { login } = useLocalSearchParams<{ login: string }>();
  const router = useRouter();
  const { data: user, isLoading, error, refetch } = useUser(login!);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-4 z-10"
        >
          <Text className="text-indigo-500 font-semibold">← Back</Text>
        </TouchableOpacity>
        <ErrorMessage
          message={error.message}
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-4"
        >
          <Text className="text-indigo-500 font-semibold">← Back</Text>
        </TouchableOpacity>
        <ErrorMessage message="User not found" onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  // Get main cursus (first one or default)
  const mainCursus = user.cursus_users[0] || { level: 0, skills: [] };
  const currentLevel = mainCursus.level || 0;
  const skills = mainCursus.skills || [];

  // Filter finished projects
  const finishedProjects = user.projects_users.filter(
    (p) => p.status === 'finished'
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className="px-4 py-2 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-indigo-500 font-semibold text-base">
              ← Back
            </Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg">{user.login}</Text>
          <View className="w-12" />
        </View>

        <View className="px-4 py-4 gap-6">
          {/* User Card */}
          <UserCard user={user} level={currentLevel} />

          {/* Skills Section */}
          {skills.length > 0 && (
            <View className="gap-3">
              <Text className="text-white font-bold text-lg">Skills</Text>
              <View className="bg-zinc-900 rounded-lg p-4 gap-2">
                {skills.map((skill) => (
                  <SkillBar key={skill.id} skill={skill} />
                ))}
              </View>
            </View>
          )}

          {/* Projects Section */}
          {finishedProjects.length > 0 && (
            <View className="gap-3 pb-4">
              <Text className="text-white font-bold text-lg">
                Projects ({finishedProjects.length})
              </Text>
              <View className="gap-2">
                {finishedProjects.map((proj) => (
                  <ProjectItem
                    key={proj.project.id}
                    name={proj.project.name}
                    passed={proj.passed}
                    mark={proj.final_mark}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Empty states */}
          {skills.length === 0 && finishedProjects.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-zinc-400">
                No skills or completed projects yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
