import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 bg-zinc-950 items-center justify-center gap-4">
        <Text className="text-white text-xl">Page not found</Text>
        <Link href="/" className="text-indigo-400 underline">
          Go home
        </Link>
      </View>
    </>
  );
}
