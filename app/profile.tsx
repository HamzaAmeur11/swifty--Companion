/**
 * app/profile.tsx — Profile Screen
 */

import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import * as Progress from 'react-native-progress';
import { type FtUser } from '../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const [activeCursus, setActiveCursus] = useState(0);

  if (!data) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No profile data.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const user: FtUser = JSON.parse(data);
  const cursus = user.cursus_users[activeCursus];
  const mainCursus =
    user.cursus_users.find((c) => c.cursus.slug === '42cursus') ??
    user.cursus_users[user.cursus_users.length - 1];

  const level = mainCursus?.level ?? 0;
  const levelInt = Math.floor(level);
  const levelFrac = level - levelInt;

  const finished = user.projects_users.filter((p) => p.status === 'finished');
  const validated = finished.filter((p) => p['validated?']);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.back}>← Search</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerCard}>
        <Image
          source={{ uri: user.image?.versions?.large ?? user.image?.link }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.displayName}>{user.displayname}</Text>
          <Text style={styles.login}>@{user.login}</Text>
          {user.campus?.[0] && <Text style={styles.campus}>📍 {user.campus[0].name}</Text>}
          {user.staff && <Text style={styles.badge}>Staff</Text>}
          {user.alumni && <Text style={styles.badge}>Alumni</Text>}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Wallet" value={`${user.wallet} ₳`} />
        <StatCard label="Eval pts" value={String(user.correction_point)} />
        <StatCard label="Level" value={level.toFixed(2)} accent />
      </View>

      {/* Level bar */}
      {mainCursus && (
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>{mainCursus.cursus.name}</Text>
            <Text style={styles.levelBadge}>Lvl {levelInt} — {(levelFrac * 100).toFixed(0)}%</Text>
          </View>
          <Progress.Bar
            progress={levelFrac} width={null} height={8}
            color="#00BABC" unfilledColor="#1e1e2e"
            borderColor="#1e1e2e" borderRadius={4}
            style={{ width: '100%', marginTop: 10 }}
          />
          {mainCursus.grade && <Text style={styles.grade}>{mainCursus.grade}</Text>}
        </View>
      )}

      {/* Cursus tabs */}
      {user.cursus_users.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.tabs} contentContainerStyle={{ gap: 8 }}>
          {user.cursus_users.map((c, i) => (
            <TouchableOpacity
              key={c.cursus.id}
              style={[styles.tab, activeCursus === i && styles.tabActive]}
              onPress={() => setActiveCursus(i)}
            >
              <Text style={[styles.tabText, activeCursus === i && styles.tabTextActive]}>
                {c.cursus.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Skills */}
      {cursus?.skills?.length > 0 && (
        <Section title="Skills">
          {cursus.skills.slice().sort((a, b) => b.level - a.level).map((skill) => (
            <View key={skill.name} style={styles.skillRow}>
              <Text style={styles.skillName} numberOfLines={1}>{skill.name}</Text>
              <View style={styles.skillRight}>
                <Progress.Bar
                  progress={Math.min(skill.level / 21, 1)} width={100} height={6}
                  color="#00BABC" unfilledColor="#1e1e2e"
                  borderColor="#1e1e2e" borderRadius={3}
                />
                <Text style={styles.skillLevel}>{skill.level.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </Section>
      )}

      {/* Projects */}
      {user.projects_users.length > 0 && (
        <Section title={`Projects (${validated.length}/${finished.length} validated)`}>
          {user.projects_users
            .filter((p) => p.cursus_ids.includes(cursus?.cursus?.id ?? 0))
            .slice()
            .sort((a, b) => {
              const rank = (p: typeof a) =>
                p.status !== 'finished' ? 1 : p['validated?'] ? 0 : 2;
              return rank(a) - rank(b);
            })
            .map((item) => (
              <View key={item.id} style={styles.projectRow}>
                <Text style={styles.projectName} numberOfLines={1}>{item.project.name}</Text>
                <View style={styles.projectRight}>
                  {item.final_mark !== null && (
                    <Text style={[styles.projectMark,
                      { color: item['validated?'] ? '#00BABC' : '#ff5555' }]}>
                      {item.final_mark}
                    </Text>
                  )}
                  <Text style={styles.projectStatus}>
                    {item.status !== 'finished' ? '⏳' : item['validated?'] ? '✅' : '❌'}
                  </Text>
                </View>
              </View>
            ))}
        </Section>
      )}
    </ScrollView>
  );
}

const StatCard = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, accent && { color: '#00BABC' }]}>{value}</Text>
  </View>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { padding: 16, paddingBottom: 48 },
  empty: { flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#555', fontSize: 16, marginBottom: 12 },
  backBtn: { marginBottom: 16 },
  back: { color: '#00BABC', fontSize: 14, fontWeight: '600' },

  headerCard: {
    flexDirection: 'row', backgroundColor: '#111118',
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#1e1e2e', gap: 16, alignItems: 'center',
  },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#00BABC' },
  headerInfo: { flex: 1 },
  displayName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 2 },
  login: { fontSize: 14, color: '#00BABC', marginBottom: 4 },
  campus: { fontSize: 13, color: '#666' },
  badge: {
    marginTop: 4, alignSelf: 'flex-start', backgroundColor: '#1e1e2e',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
    color: '#00BABC', fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1,
  },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#111118', borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#1e1e2e',
  },
  statLabel: { fontSize: 11, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#fff' },

  levelCard: {
    backgroundColor: '#111118', borderRadius: 14, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#1e1e2e',
  },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  levelBadge: { fontSize: 13, color: '#00BABC', fontWeight: '600' },
  grade: { marginTop: 8, fontSize: 13, color: '#555' },

  tabs: { marginBottom: 16 },
  tab: {
    paddingVertical: 8, paddingHorizontal: 14,
    backgroundColor: '#111118', borderRadius: 20,
    borderWidth: 1, borderColor: '#1e1e2e',
  },
  tabActive: { backgroundColor: '#00BABC', borderColor: '#00BABC' },
  tabText: { fontSize: 13, color: '#555', fontWeight: '600' },
  tabTextActive: { color: '#0a0a0f' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 10 },
  sectionCard: {
    backgroundColor: '#111118', borderRadius: 14,
    borderWidth: 1, borderColor: '#1e1e2e', overflow: 'hidden',
  },

  skillRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#1a1a28',
  },
  skillName: { flex: 1, fontSize: 14, color: '#bbb' },
  skillRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  skillLevel: { fontSize: 13, color: '#00BABC', fontWeight: '700', width: 36, textAlign: 'right' },

  projectRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 11, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#1a1a28',
  },
  projectName: { flex: 1, fontSize: 14, color: '#bbb' },
  projectRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  projectMark: { fontSize: 14, fontWeight: '700', width: 30, textAlign: 'right' },
  projectStatus: { fontSize: 16 },
});
