import CustomMediumText from "@/components/CustomMediumText";
import CustomText from "@/components/CustomText";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/Colors";
import { useDiaryCreateStorev2 } from "../../store/DiaryCreateStorev2";
import { useDiaryStore } from "../../store/DiaryStore";

export default function CompleteScreen() {
  const router = useRouter();
  const { 
    images, 
    visibility, 
    date, 
    emotions,
    folderId,
    reset 
  } = useDiaryCreateStorev2();
  
  const addDiary = useDiaryStore(state => state.addDiary);

  useEffect(() => {
    // 일기 데이터를 스토어에 저장
    console.log("CompleteScreen useEffect 실행됨");
    console.log("folderId:", folderId);
    console.log("date:", date);
    console.log("images:", Array.from(images));
    console.log("emotions:", emotions);
    console.log("visibility:", visibility);
    
    // 스토어 전체 상태 확인
    const storeState = useDiaryCreateStorev2.getState();
    console.log("전체 스토어 상태:", storeState);
    
    // 스토어에서 직접 데이터 가져오기
    const actualFolderId = storeState.folderId;
    const actualDate = storeState.date;
    const actualImages = Array.from(storeState.images);
    const actualEmotions = storeState.emotions;
    const actualVisibility = storeState.visibility;
    
    console.log("스토어에서 직접 가져온 데이터:");
    console.log("- folderId:", actualFolderId);
    console.log("- date:", actualDate);
    console.log("- images:", actualImages);
    console.log("- emotions:", actualEmotions);
    console.log("- visibility:", actualVisibility);
    
    // 이미 저장된 일기가 있는지 확인
    const existingDiaries = useDiaryStore.getState().diaries;
    const existingDiary = existingDiaries.find(diary => 
      diary.folderId === actualFolderId && diary.date === actualDate
    );
    
    if (existingDiary) {
      console.log("이미 저장된 일기가 있음:", existingDiary);
      return;
    }
    
    // 스토어에서 가져온 데이터로 일기 저장
    if (actualDate) {
      const diaryData = {
        folderId: actualFolderId || `temp_${Date.now()}`,
        date: actualDate,
        images: actualImages,
        emotions: actualEmotions,
        visibility: actualVisibility,
        title: `${actualDate}의 여행 일기`,
        content: `${actualDate}에 기록한 여행 일기입니다.`,
      };
      
      addDiary(diaryData);
      console.log("일기 데이터 저장됨:", diaryData);
      
      // 저장 후 일기 목록 확인
      const diaries = useDiaryStore.getState().diaries;
      console.log("현재 저장된 일기 목록:", diaries);
    } else {
      console.log("스토어에서 date가 없어서 일기 저장 안됨");
    }
  }, []); // 의존성 배열을 비워서 한 번만 실행되도록 수정

  const handleComplete = () => {
    // 스토어 초기화
    reset();
    // 기록함 탭으로 이동
    router.push("/(tabs)/mydiary"); 
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Confirm.png')} style={styles.icon} />
      <CustomMediumText style={styles.title}>일기 생성 완료</CustomMediumText>
      <CustomText style={styles.subtitle}>당신의 여행 이야기가 완성되었어요</CustomText>
      
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <CustomMediumText style={styles.buttonText}>완료</CustomMediumText>
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
    fontSize: 18,
  },
  icon: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    marginBottom: 18,
  },
}); 