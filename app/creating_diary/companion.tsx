import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { colors } from "../../constants/Colors";
import companions from "../../constants/companions";
import { useDiaryFormStore } from '../../store/useDiaryFormStore';

const TravelCompanionScreen: React.FC = () => {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("../../assets/fonts/NotoSansKR-Regular.ttf"),
  });

  const [selectedKey, setSelectedKey] = useState<string>(companions[0].key);
  const router = useRouter();
  const { setCompanion } = useDiaryFormStore();

  const handleNext = () => {
    if (!selectedKey) {
      Alert.alert("알림", "동행자를 선택해주세요.");
      return;
    }

    setCompanion(selectedKey);
    router.push("/creating_diary/emotion");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.DARK_GRAY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRAVEL DIARY</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.headerHr} />

      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: "66.66%" }]} />
        </View>
        <Text style={styles.progressText}>2/3</Text>
      </View>

      {/* Main Question */}
      <Text style={styles.question}>이번 여행은 누구와 함께 하셨나요?</Text>

      {/* 선택지 카드 */}
      <View style={styles.cardList}>
        {companions.map((item) => {
          const isSelected = selectedKey === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.card,
                isSelected ? styles.cardSelected : styles.cardUnselected,
              ]}
              activeOpacity={0.85}
              onPress={() => setSelectedKey(item.key)}
            >
              <Text style={[styles.cardTitle, isSelected && { color: colors.BLUE }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardSubtitle, isSelected && { color: colors.BLUE }]}>
                {item.subtitle}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 24,
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
    width: "100%",
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
    height: 6,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 3,
    marginRight: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
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
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.BLACK,
    textAlign: "center",
    marginVertical: 32,
  },
  cardList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: {
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  cardSelected: {
    borderColor: colors.BLUE,
    backgroundColor: "#EAF1FE",
  },
  cardUnselected: {
    borderColor: colors.LIGHT_GRAY,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.DARK_GRAY,
    marginBottom: 6,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#A0A0A0",
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: colors.BLUE,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default TravelCompanionScreen;

export const options = {
  headerShown: false,
};

