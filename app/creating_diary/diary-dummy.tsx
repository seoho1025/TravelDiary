import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/Colors";

interface DiaryData {
  author: {
    name: string;
    profileImage: string;
  };
  date: string;
  title: string;
  image: any;
  diary: string;
}

const dummyData: DiaryData = {
  author: {
    name: "김여행",
    profileImage: "https://via.placeholder.com/40",
  },
  date: "2025년 5월 1일",
  title: "2025년 5월, 독일에서의 잔잔한 기억",
  image: require("../../assets/images/Germany.png"),
  diary: "오늘은 독일의 작은 마을을 걷는 하루였다.\n아침 햇살이 부드럽게 창문을 타고 들어와 내 마음까지 따뜻하게 감싸주었다.\n고풍스러운 돌길과 알록달록한 꽃들이 어우러진 거리를 거닐며, 시간도 잠시 쉬어가는 듯했다.\n해가 지고 나서 본 작은 성의 야경은 마법 같았다.\n불빛 아래 고요한 강물과 성벽이 어우러져, 마치 동화 속 한 장면에 들어온 것만 같았다.\n오늘 하루, 독일은 내게 조용한 행복과 평화를 선물해 주었다.",
};

export default function DiaryDummyScreen() {
  const [loading, setLoading] = useState(true);
  const [diary, setDiary] = useState<DiaryData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDiary(dummyData);
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingTitle}>일기 생성중</Text>
          <Text style={styles.loadingSubtitle}>추억을 기록하는 순간</Text>
          <ActivityIndicator size="large" color={colors.BLUE} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  if (!diary) return <Text>일기 데이터가 없습니다.</Text>;

  const author = diary.author;
  const date = diary.date;
  const title = diary.title;
  const image = diary.image;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color={colors.DARKER_GRAY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRAVEL DIARY</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color={colors.DARKER_GRAY} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerHr} />

      <ScrollView style={styles.container}>
        <View style={styles.infoRow}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: author.profileImage }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{author.name}</Text>
          </View>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.mainImage} />
        </View>
        <View style={styles.editRow}>
          <TouchableOpacity>
            <Text style={styles.editText}>수정하기</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{diary.diary}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: colors.WHITE,
    borderRadius: 18,
    paddingHorizontal: 32,
    paddingVertical: 32,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.DARK_GRAY,
    marginBottom: 10,
  },
  loadingSubtitle: {
    fontSize: 15,
    color: colors.DARK_GRAY,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingTop: 160,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.WHITE,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: colors.BLUE,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    flex: 1,
  },
  headerHr: {
    width: "100%",
    height: 1,
    backgroundColor: colors.LIGHT_GRAY,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 4,
    marginTop: 18,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.LIGHT_GRAY,
    marginRight: 7,
  },
  profileName: {
    fontSize: 13,
    color: colors.DARK_GRAY,
    fontWeight: "600",
    fontFamily: "NotoSansKR",
  },
  dateText: {
    fontSize: 12,
    color: colors.DARK_GRAY,
    fontFamily: "NotoSansKR",
    fontWeight: "500",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  mainImage: {
    width: Dimensions.get("window").width - 40,
    height: (Dimensions.get("window").width - 40) * 0.6,
    borderRadius: 14,
    resizeMode: "cover",
    backgroundColor: colors.LIGHT_GRAY,
    alignSelf: "center",
  },
  editRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  editText: {
    fontSize: 13,
    color: colors.BLUE,
    fontWeight: "500",
    fontFamily: "NotoSansKR",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARKER_GRAY,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    fontFamily: "NotoSansKR",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.DARK_GRAY,
    paddingHorizontal: 20,
    paddingBottom: 32,
    fontFamily: "NotoSansKR",
  },
}); 