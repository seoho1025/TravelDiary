import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { colors } from "../../constants/Colors";
import EMOTIONS from "../../constants/emotions";
import { useDiaryFormStore } from '../../store/useDiaryFormStore';

SplashScreen.preventAutoHideAsync();

export default function EmotionScreen() {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("../../assets/fonts/NotoSansKR-Regular.ttf"),
  });

  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const router = useRouter();
  const { setEmotions } = useDiaryFormStore();
  

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => {
      if (prev.includes(emotion)) {
        return prev.filter((e) => e !== emotion);
      } else {
        if (prev.length >= 2) {
          Alert.alert("감정은 최대 2개까지만 선택할 수 있어요.");
          return prev;
        }
        return [...prev, emotion];
      }
    });
  };

  const handleNext = () => {
    if (selectedEmotions.length === 0) {
      Alert.alert("알림", "감정을 하나 이상 선택해주세요.");
      return;
    }

    setEmotions(selectedEmotions);
    router.push("/creating_diary/diary-dummy");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: -16 }}>
            <Ionicons name="chevron-back" size={28} color={colors.DARK_GRAY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>TRAVEL DIARY</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.headerHr} />

        {/* Progress Bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: "100%" }]} />
          </View>
          <Text style={styles.progressText}>3/3</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>그 순간, 나는 ___ 감정이 들었어요.</Text>

        {/* Multiple Selection Notice - 제목 바로 아래 */}
        <View style={styles.multipleSelectionNotice}>
          <Text style={styles.multipleSelectionText}>중복 선택도 가능해요</Text>
        </View>

        {/* '없음' 단독 줄 */}
        <View style={{ flexDirection: "row", marginBottom: 16, marginTop: 40 }}>
          <TouchableOpacity
            style={[
              styles.emotionButton,
              selectedEmotions.includes("없음") && styles.emotionButtonSelected,
              { width: "30%", marginRight: 12 },
            ]}
            onPress={() => toggleEmotion("없음")}
          >
            <Text
              style={[
                styles.emotionButtonText,
                selectedEmotions.includes("없음") && styles.emotionButtonTextSelected,
              ]}
            >
              없음
            </Text>
          </TouchableOpacity>
        </View>

        {/* 나머지 감정 3개씩 없음 아래로 나열 */}
        <View style={[styles.emotionGridWrap, { marginTop: 0 }]}>
          {Array.from({ length: Math.ceil(EMOTIONS.length / 3) }).map((_, rowIdx) => (
            <View key={rowIdx} style={styles.emotionRow}>
              {EMOTIONS.slice(rowIdx * 3, rowIdx * 3 + 3).map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  style={[
                    styles.emotionButton,
                    selectedEmotions.includes(emotion) && styles.emotionButtonSelected,
                    { marginRight: 12 },
                  ]}
                  onPress={() => toggleEmotion(emotion)}
                >
                  <Text
                    style={[
                      styles.emotionButtonText,
                      selectedEmotions.includes(emotion) && styles.emotionButtonTextSelected,
                    ]}
                  >
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingTop: 24,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
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
    width: '100%',
    height: 1,
    backgroundColor: colors.LIGHT_GRAY,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 4,
    marginRight: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.BLUE,
    borderRadius: 4,
  },
  progressText: {
    color: colors.DARK_GRAY,
    fontWeight: "bold",
    fontSize: 14,
    minWidth: 36,
    textAlign: "right",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.BLACK,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 28,
    marginTop: 48,
  },
  multipleSelectionNotice: {
    backgroundColor: colors.BACKGROUND_GRAY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 4,
    marginTop: -18,
  },
  multipleSelectionText: {
    color: colors.BLUE,
    fontSize: 14,
    fontWeight: "bold",
  },
  emotionGridWrap: {
    marginTop: 0,
    marginBottom: 0,
  },
  emotionRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  emotionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY,
    backgroundColor: colors.WHITE,
    width: "30%",
    alignItems: "center",
  },
  emotionButtonSelected: {
    backgroundColor: colors.BLUE,
    borderColor: colors.BLUE,
  },
  emotionButtonText: {
    color: colors.DARK_GRAY,
    fontSize: 16,
    fontWeight: "500",
  },
  emotionButtonTextSelected: {
    color: colors.WHITE,
  },
  nextButton: {
    backgroundColor: colors.BLUE,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
  },
  nextButtonText: {
    color: colors.WHITE,
    fontWeight: "bold",
    fontSize: 16,
  },
}); 