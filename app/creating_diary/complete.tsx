import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/Colors";

export default function CompleteScreen() {
  const router = useRouter();

  // 예시: 로딩(Loading) 컴포넌트에서 자동 이동
  useEffect(() => {
    // 만약 이전 화면에서 router.push('/screens/Complete')로 이동하도록 처리했다면 이 부분은 생략 가능
    // 예시: setTimeout(() => router.push('/screens/Complete'), 3000);
  }, [router]);

  const handleComplete = () => {
    // 완료 버튼 클릭 시 동작 (예: 홈으로 이동 등)
    router.push("/creating_diary/diary"); 
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Confirm.png')} style={styles.icon} />
      <Text style={styles.title}>일기 생성 완료</Text>
      <Text style={styles.subtitle}>당신의 여행 이야기가 완성되었어요</Text>
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.DARK_GRAY,
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: colors.DARK_GRAY,
    marginBottom: 60,
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: colors.BLUE,
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.WHITE,
    fontWeight: 'bold',
    fontSize: 18,
  },
  icon: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    marginBottom: 18,
  },
}); 