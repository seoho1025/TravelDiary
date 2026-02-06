import CustomMediumText from "@/components/CustomMediumText";
import CustomText from "@/components/CustomText";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import Header from '../../components/Header';
import { colors } from '../../constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function EmotionScreen() {

  const [selectedEmotion, setSelectedEmotion] = useState<'positive' | 'negative' | null>(null);
  const router = useRouter();

  const handleEmotionSelect = (emotion: 'positive' | 'negative') => {
    setSelectedEmotion(emotion);
  };

  const handleNext = () => {
    if (selectedEmotion) {
      // 감정 정보를 스토어에 저장하거나 다음 화면으로 이동
      if (selectedEmotion === 'positive') {
        router.push("./PositiveEmotionScreen");
      } else {
        router.push("./NegativeEmotionScreen");
      }
    }
  };

  return (
    <View style={styles.safeArea}>
      <Header />
      
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Progress Bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: "66.66%" }]} />
          </View>
          <CustomText style={styles.progressText}>2/3</CustomText>
        </View>

        {/* Question */}
        <CustomMediumText style={styles.question}>
          그날의 감정은 어땠나요?
        </CustomMediumText>

        {/* Emotion Selection Cards */}
        <View style={styles.emotionCardsContainer}>
          {/* Positive Card */}
          <TouchableOpacity
            style={[
              styles.emotionCard,
              styles.positiveCard,
              selectedEmotion === 'positive' && styles.selectedCard
            ]}
            onPress={() => handleEmotionSelect('positive')}
            activeOpacity={0.8}
          >
            <CustomText style={styles.emoji}>😀</CustomText>
            <CustomMediumText style={styles.emotionText}>긍정적</CustomMediumText>
            <TouchableOpacity
              style={[
                styles.selectButton,
                styles.positiveButton,
                selectedEmotion === 'positive' && styles.selectedButton
              ]}
              onPress={() => handleEmotionSelect('positive')}
            >
              <CustomText style={[
                styles.selectButtonText,
                styles.positiveButtonText,
                selectedEmotion === 'positive' && styles.selectedButtonText
              ]}>
                선택
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Negative Card */}
          <TouchableOpacity
            style={[
              styles.emotionCard,
              styles.negativeCard,
              selectedEmotion === 'negative' && styles.selectedCard
            ]}
            onPress={() => handleEmotionSelect('negative')}
            activeOpacity={0.8}
          >
            <CustomText style={styles.emoji}>🙁</CustomText>
            <CustomMediumText style={styles.emotionText}>부정적</CustomMediumText>
            <TouchableOpacity
              style={[
                styles.selectButton,
                styles.negativeButton,
                selectedEmotion === 'negative' && styles.selectedButton
              ]}
              onPress={() => handleEmotionSelect('negative')}
            >
              <CustomText style={[
                styles.selectButtonText,
                styles.negativeButtonText,
                selectedEmotion === 'negative' && styles.selectedButtonText
              ]}>
                선택
              </CustomText>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        {selectedEmotion && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <CustomMediumText style={styles.nextButtonText}>다음</CustomMediumText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.WHITE_RGB,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_RGB,
    paddingHorizontal: 20,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 8,
  },
  progressText: {
    color: colors.DARK_GRAY,
    fontSize: 14,
    minWidth: 36,
    textAlign: "right",
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 4,
    marginRight: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.BLUE,
    borderRadius: 4,
  },
  question: {
    fontSize: 20,
    color: colors.BLACK,
    textAlign: "center",
    marginBottom: 40,
    marginTop: 40,
    lineHeight: 32,
  },
  emotionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 40,
  },
  emotionCard: {
    width: '48%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  positiveCard: {
    backgroundColor: colors.BLUE,
  },
  negativeCard: {
    backgroundColor: '#8B5CF6', // Purple
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: colors.WHITE_RGB,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emotionText: {
    fontSize: 18,
    color: colors.WHITE_RGB,
    marginBottom: 20,
  },
  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  positiveButton: {
    backgroundColor: colors.WHITE_RGB,
    borderColor: colors.BLUE,
  },
  negativeButton: {
    backgroundColor: colors.WHITE_RGB,
    borderColor: '#8B5CF6',
  },
  selectedButton: {
    backgroundColor: colors.WHITE_RGB,
    borderColor: colors.WHITE_RGB,
  },
  selectButtonText: {
    fontSize: 14,
  },
  positiveButtonText: {
    color: colors.BLUE,
  },
  negativeButtonText: {
    color: '#8B5CF6',
  },
  selectedButtonText: {
    color: colors.DARK_GRAY,
  },
  nextButton: {
    backgroundColor: colors.BLUE,
    borderRadius: 40,
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    elevation: 4,
  },
  nextButtonText: {
    color: colors.WHITE_RGB,
    fontSize: 18,
  },
});

export const options = {
  headerShown: false,
};
