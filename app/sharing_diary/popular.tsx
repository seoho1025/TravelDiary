import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Diary = {
  id: number;
  content: string;
  createdAt: string;
  authorNickname: string;
  thumbnailUrl: string;
};

export default function Popular() {
  const [data, setData] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<'all' | 'random' | 'europe'>('all');

  useEffect(() => {
    axios.get<Diary[]>('https://travel-journal-ai.onrender.com/diaries/public')
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>에러 발생: {error.message}</Text>;

  // 실제로는 filter에 따라 data를 분류해야 하지만, 지금은 API가 한 종류라서 전체 data만 사용
  const filteredDiaries = data; // 추후 filter별로 분기 가능

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 오늘의 베스트 여행일기 */}
        <Text style={styles.sectionTitle}>오늘의 베스트</Text>
        <Text style={styles.sectionTitle2}>여행일기</Text>
        <View style={styles.bestRow}>
          {data.slice(0, 2).map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.thumbnailUrl }} style={styles.cardImage} />
              <View style={styles.cardContentWrap}>
                <Text style={styles.profileName}>{item.authorNickname}</Text>
                <Text style={styles.cardContent} numberOfLines={2}>{item.content}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 주제별로 모아보는 인기 여행일기 */}
        <Text style={styles.sectionTitle}>주제별로 모아보는</Text>
        <Text style={styles.sectionTitle2}>인기 여행일기</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={filter === "random" ? styles.filterBtnActive : styles.filterBtn}
            onPress={() => setFilter("random")}
          >
            <Text style={filter === "random" ? styles.filterBtnTextActive : styles.filterBtnText}>
              그냥 랜덤으로 볼래요!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={filter === "europe" ? styles.filterBtnActive : styles.filterBtn}
            onPress={() => setFilter("europe")}
          >
            <Text style={filter === "europe" ? styles.filterBtnTextActive : styles.filterBtnText}>
              #유럽 여행
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bestRow}>
          {filteredDiaries.slice(2, 6).map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.thumbnailUrl }} style={styles.cardImage} />
              <View style={styles.cardContentWrap}>
                <Text style={styles.profileName}>{item.authorNickname}</Text>
                <Text style={styles.cardContent} numberOfLines={2}>{item.content}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginTop: 20,
    marginLeft: 20,
  },
  sectionTitle2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    marginLeft: 20,
  },
  bestRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    justifyContent: "center",
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 170,
    marginHorizontal: 4,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: "cover",
  },
  cardContentWrap: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  profileName: {
    fontSize: 13,
    color: "#888",
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    marginLeft: 20,
  },
  filterBtnActive: {
    backgroundColor: "#4263EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterBtn: {
    backgroundColor: "#F2F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterBtnTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  filterBtnText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 13,
  },
});