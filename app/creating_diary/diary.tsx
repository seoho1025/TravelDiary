import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { API_URL } from "../../constants/api";
import { colors } from "../../constants/Colors";
import LoadingScreen from "./loading";

// 임시 더미 데이터
const dummyData = {
  author: {
    name: "김여행",
    profileImage: "https://via.placeholder.com/40",
  },
  date: "2025년 5월 1일",
  title: "2025년 5월, 독일에서의 잔잔한 기억",
  image: require("../../assets/images/Germany.png"),
};

export default function DiaryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [diary, setDiary] = useState<
    | {
        diary: string;
        author?: { name: string; profileImage: string };
        date?: string;
        title?: string;
        image?: string;
      }
    | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await axios.get(`${API_URL}/diary/${id}`);
        setDiary(response.data); // { diary: "..." } 형태라고 가정
      } catch (error) {
        console.error("일기 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDiary();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!diary) return <Text>일기 데이터가 없습니다.</Text>;

  // API에서 받아온 데이터 구조 예시: { diary: "...", author: { name, profileImage }, date, title, image }
  const author = diary.author || dummyData.author;
  const date = diary.date || dummyData.date;
  const title = diary.title || dummyData.title;
  const image = diary.image || dummyData.image;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.DARKER_GRAY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRAVEL DIARY</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color={colors.DARKER_GRAY} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerHr} />

      <ScrollView style={styles.container}>
        {/* 사진 위에 겹치지 않고, 사진과 최대한 근접하게 프로필/닉네임, 날짜 배치 */}
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
          {/* image가 string이면 uri로, require면 그대로 */}
          {typeof image === 'string' ? (
            <Image source={{ uri: image }} style={styles.mainImage} />
          ) : (
            <Image source={image} style={styles.mainImage} />
          )}
        </View>
        <View style={styles.editRow}>
          <TouchableOpacity>
            <Text style={styles.editText}>수정하기</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Content */}
        <Text style={styles.content}>{diary.diary}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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