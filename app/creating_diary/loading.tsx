import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/Colors";
import { useDiaryCreateStore } from "../../store/diaryCreateStore";
import { useDiaryFormStore } from "../../store/useDiaryFormStore";

export default function LoadingScreen() {
  const router = useRouter();
  const createDiary = useDiaryCreateStore((state) => state.createDiary);
  const toCreateParams = useDiaryFormStore((state) => state.toCreateParams);
  const globalError = useDiaryCreateStore((state) => state.error);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const create = async () => {
      console.log('일기 생성 요청 데이터:', toCreateParams().date);
      try {
        await createDiary(toCreateParams(), () => {
          router.replace("/creating_diary/complete");
        });
      } catch (e: any) {
        setError(
          (typeof globalError === 'string' && globalError)
            ? globalError
            : "일기 생성에 실패했습니다.\n잠시 후 다시 시도해 주세요."
        );
      } finally {
        setIsLoading(false);
      }
    };
    create();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>일기 생성중</Text>
          <Text style={styles.subtitle}>추억을 기록하는 순간</Text>
          <ActivityIndicator size="large" color={colors.BLUE} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>에러 발생</Text>
          <Text style={styles.subtitle}>{error}</Text>
          <View style={{ height: 24 }} />
          <Text
            style={{ color: '#3E69EE', fontWeight: 'bold', marginBottom: 12 }}
            onPress={() => router.back()}
          >
            이전 화면으로 돌아가기
          </Text>
          <Text
            style={{ color: '#3E69EE', fontWeight: 'bold' }}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              // 재시도
              const create = async () => {
                try {
                  await createDiary(toCreateParams(), () => {
                    router.replace("/creating_diary/complete");
                  });
                } catch (e: any) {
                  setError(
                    (typeof globalError === 'string' && globalError)
                      ? globalError
                      : "일기 생성에 실패했습니다.\n잠시 후 다시 시도해 주세요."
                  );
                } finally {
                  setIsLoading(false);
                }
              };
              create();
            }}
          >
            다시 시도하기
          </Text>
        </View>
      </View>
    );
  }

  // isLoading도 아니고 error도 아닌 경우(예상치 못한 오류)
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>예상치 못한 오류가 발생했습니다.</Text>
        <Text style={styles.subtitle}>앱을 재시작하거나, 이전 화면으로 돌아가 주세요.</Text>
        <Text
          style={{ color: '#3E69EE', fontWeight: 'bold', marginTop: 16 }}
          onPress={() => router.back()}
        >
          이전 화면으로 돌아가기
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
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
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.DARK_GRAY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: colors.DARK_GRAY,
  },
}); 