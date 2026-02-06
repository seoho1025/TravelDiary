import CustomMediumText from "@/components/CustomMediumText";
import CustomText from "@/components/CustomText";
import { DIARY_API_URL } from "@/constants/api";
import { useFonts } from "expo-font";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View
} from "react-native";
import Header from '../../components/Header';
import { colors } from '../../constants/Colors';
import { useDiaryCreateStorev2 } from '../../store/DiaryCreateStorev2';
import { useDiaryStore } from '../../store/DiaryStore';

SplashScreen.preventAutoHideAsync();

export default function LoadingScreen() {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("../../assets/fonts/NotoSansKR-Regular.ttf"),
  });

  const [loadingMessage, setLoadingMessage] = useState("데이터를 준비하고 있습니다...");
  const router = useRouter();
  const params = useLocalSearchParams();
  const urlFolderId = params.folderId as string;
  
  const { 
    images, 
    visibility, 
    date, 
    emotions,
    folderId,
    reset 
  } = useDiaryCreateStorev2();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // 컴포넌트 마운트 시 백엔드로 데이터 전송 시작
    sendDataToBackend();
  }, []);

  const sendDataToBackend = async () => {
    try {
      // 1단계: 데이터 준비
      setLoadingMessage("데이터를 준비하고 있습니다...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2단계: 이미지 파일들을 FormData로 준비
      setLoadingMessage("이미지를 준비하고 있습니다...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 이미지 파일들을 FormData에 추가
      const formData = new FormData();
      
      // 이미지 URI들을 실제 파일로 변환
      const imageFiles = await Promise.all(
        Array.from(images).map(async (imageUri, index) => {
          console.log(`이미지 ${index + 1} 처리:`, imageUri);
          
          // 파일 확장자 확인 (대소문자 구분)
          const originalExtension = imageUri.split('.').pop() || 'jpg';
          const extension = originalExtension.toLowerCase();
          
          // MIME 타입 매핑
          const mimeTypeMap: { [key: string]: string } = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp'
          };
          
          const mimeType = mimeTypeMap[extension] || 'image/jpeg';
          
          const fileInfo = {
            uri: imageUri,
            type: mimeType,
            name: `image_${index}.${extension}`
          } as any; // React Native에서는 이렇게 타입 우회 필요
          
          console.log(`이미지 ${index + 1} 파일 정보:`, fileInfo);
          
          // 파일 크기 확인 (선택사항)
          try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            console.log(`이미지 ${index + 1} 크기:`, blob.size, 'bytes');
            if (blob.size > 5 * 1024 * 1024) { // 5MB 이상
              console.log(`⚠️ 이미지 ${index + 1}이 너무 큽니다. (${Math.round(blob.size / 1024 / 1024)}MB) 서버에서 거부할 수 있습니다.`);
            }
            if (blob.size > 10 * 1024 * 1024) { // 10MB 이상
              console.log(`🚨 이미지 ${index + 1}이 매우 큽니다. (${Math.round(blob.size / 1024 / 1024)}MB) 업로드가 실패할 가능성이 높습니다.`);
            }
          } catch (error) {
            console.log(`이미지 ${index + 1} 크기 확인 실패:`, error);
          }
          
          return fileInfo;
        })
      );

      // FormData에 이미지 파일들 추가 (별도로)
      imageFiles.forEach((file, index) => {
        console.log(`FormData에 이미지 ${index + 1} 추가:`, file);
        formData.append('images', file as any);
      });

      // 스토어에서 folderId를 우선 사용하고, 없으면 URL 파라미터 사용
      const finalFolderId = folderId || urlFolderId;

      // 나머지 데이터를 JSON으로 추가
      const diaryData = {
        folderId: parseInt(finalFolderId), // 숫자로 변환
        date: date,
        visibility: visibility.toUpperCase(), // PUBLIC/PRIVATE로 변환
        emotions: emotions,
      };

      // FormData에 JSON 데이터 추가
      formData.append('data', JSON.stringify(diaryData));
      

      // FormData 내용 확인
      console.log("=== FormData 상세 정보 ===");
      console.log("이미지 파일 수:", imageFiles.length);
      console.log("JSON 데이터:", JSON.stringify(diaryData));
      console.log("==========================");

      // FormData의 boundary 확인
      const formDataString = formData.toString();
      console.log("FormData 문자열:", formDataString);

      console.log("=== LoadingScreen 디버깅 정보 ===");
      console.log("스토어 folderId:", folderId);
      console.log("URL folderId:", urlFolderId);
      console.log("최종 사용할 folderId:", finalFolderId);
      console.log("스토어 전체 상태:", { images: images.size, visibility, date, emotions, folderId });
      console.log("전송할 데이터:", diaryData);
      console.log("이미지 파일 수:", imageFiles.length);
      console.log("================================");

      // 3단계: 실제 API 호출
      setLoadingMessage("다이어리를 저장하고 있습니다...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 서버 헬스체크 먼저 시도
      try {
        console.log("=== 서버 헬스체크 시작 ===");
        
        // AbortController를 사용한 타임아웃 구현
        const healthController = new AbortController();
        const healthTimeout = setTimeout(() => healthController.abort(), 10000);
        
        const healthCheckResponse = await fetch(`${DIARY_API_URL.replace('/api/diary', '')}`, {
          method: 'GET',
          signal: healthController.signal,
        });
        
        clearTimeout(healthTimeout);
        console.log("헬스체크 응답:", healthCheckResponse.status);
        
        if (healthCheckResponse.status !== 200) {
          console.log("서버가 정상적으로 응답하지 않습니다.");
          throw new Error("서버 상태 불량");
        }
      } catch (healthError) {
        console.log("헬스체크 실패:", healthError);
        if (healthError instanceof Error) {
          if (healthError.name === 'AbortError') {
            console.log("헬스체크 타임아웃");
          } else if (healthError.name === 'TypeError') {
            console.log("네트워크 연결 문제");
          }
        }
        console.log("서버가 다운되어 있거나 네트워크 문제가 있을 수 있습니다.");
      }

      try {
          // 일기 생성 API 호출
          console.log("=== API 호출 시작 ===");
          console.log("API URL:", DIARY_API_URL);
          
          // 타임아웃 없이 무한 대기
          console.log("서버 응답을 기다리는 중... (타임아웃 없음)");
          
          // 기존 FormData 사용 (새로 생성하지 않음)
          console.log("전송할 FormData:", formData);
          console.log("FormData의 data 값:", formData.get('data'));   
          console.log("FormData의 images 값:", formData.get('images')); 
          
          // 모든 images 값 확인
          const allImages = [];
          for (let i = 0; i < imageFiles.length; i++) {
            allImages.push(formData.get('images'));
          }
          console.log("FormData의 모든 images 값:", allImages);
          console.log("실제 전송할 이미지 개수:", imageFiles.length);

          // Content-Type 확인을 위한 로그 추가
          console.log("=== 전송 정보 ===");
          console.log("요청 URL:", DIARY_API_URL);
          console.log("요청 메서드:", 'POST');
          console.log("FormData 내용:", formData);
          
          const response = await fetch(DIARY_API_URL, {
            method: 'POST',
            body: formData,
            // signal 제거하여 타임아웃 없음
          });
          
          // clearTimeout(timeout); // 타임아웃 제거

          console.log("=== API 응답 정보 ===");
          console.log("Response status:", response.status);
          console.log("Response ok:", response.ok);
          console.log("Response headers:", response.headers);

          if (!response.ok) {
            const errorText = await response.text();
            console.log("서버 에러 응답:", errorText);
            console.log("서버 에러 상태 코드:", response.status);
            console.log("서버 에러 헤더:", response.headers);
            
            // JSON 파싱 시도
            try {
              const errorJson = JSON.parse(errorText);
              console.log("서버 에러 JSON:", errorJson);
            } catch (e) {
              console.log("서버 에러 응답이 JSON이 아님");
            }
            
            throw new Error(`서버 에러: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          console.log("서버 응답 성공:", result);
          
          // 서버 응답 성공 시 로컬 스토어에 저장
          if (result.diaryId && date && folderId) {
            console.log("=== 로컬 스토어에 일기 저장 시작 ===");
            console.log("서버 응답 diaryId:", result.diaryId);
            console.log("서버 응답 데이터:", result);
            console.log("사용할 folderId:", folderId);
            console.log("사용할 date:", date);
            
            // 서버에서 받은 데이터를 기반으로 로컬에 저장
            const diaryData = {
              folderId: folderId.toString(), // 문자열로 변환
              date: date,
              images: Array.from(images),
              emotions: emotions,
              visibility: visibility,
              title: result.title || `${date}의 여행 일기`, // 서버에서 받은 제목 사용
              content: result.content || `${date}에 기록한 여행 일기입니다.`, // 서버에서 받은 내용 사용
              id: result.diaryId.toString(), // 서버에서 받은 ID 사용
            };
            
            const addDiary = useDiaryStore.getState().addDiary;
            addDiary(diaryData);
            console.log("로컬 스토어에 일기 저장 완료:", diaryData);
            
            // 저장 후 일기 목록 확인
            const diaries = useDiaryStore.getState().diaries;
            console.log("현재 저장된 일기 목록:", diaries);
            console.log("저장된 일기 개수:", diaries.length);
          } else {
            console.log("서버 응답은 성공했지만 로컬 저장에 필요한 데이터가 부족:", { diaryId: result.diaryId, date, folderId });
          }

        } catch (error) {
        console.log("=== 서버 연결 실패 상세 정보 ===");
        console.log("에러 타입:", typeof error);
        console.log("에러 메시지:", error instanceof Error ? error.message : String(error));
        console.log("에러 스택:", error instanceof Error ? error.stack : 'No stack trace');
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log("요청이 타임아웃되었습니다. (10초)");
            setLoadingMessage("서버 응답이 지연되어 로컬에 저장합니다...");
          } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.log("네트워크 연결 문제로 보입니다.");
            setLoadingMessage("네트워크 연결 문제로 로컬에 저장합니다...");
          } else {
            setLoadingMessage("서버 연결 문제로 로컬에 저장합니다...");
          }
        }
        
        console.log("서버 연결 실패, 로컬에만 저장:", error);
        
        // 서버 실패 시에도 로컬 스토어에 저장
        if (date && folderId) {
          const diaryData = {
            folderId: folderId.toString(),
            date: date,
            images: Array.from(images),
            emotions: emotions,
            visibility: visibility,
            title: `${date}의 여행 일기`,
            content: `${date}에 기록한 여행 일기입니다.`,
          };
          
          const addDiary = useDiaryStore.getState().addDiary;
          addDiary(diaryData);
          console.log("서버 실패 시 로컬 스토어에 일기 저장됨:", diaryData);
          
          // 저장 후 일기 목록 확인
          const diaries = useDiaryStore.getState().diaries;
          console.log("현재 저장된 일기 목록:", diaries);
          
          // 잠시 대기 후 완료 메시지
          await new Promise(resolve => setTimeout(resolve, 2000));
          setLoadingMessage("로컬 저장 완료!");
        }
      }

      // 4단계: 성공 메시지 (서버 성공/실패 관계없이)
      setLoadingMessage("완료되었습니다!");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 5단계: 다음 화면으로 이동
      console.log("=== 화면 전환 시작 ===");
      try {
        router.replace("/creating_diary_v2/CompleteScreen");
        console.log("화면 전환 성공");
      } catch (routerError) {
        console.error("화면 전환 실패:", routerError);
        // 대체 방법으로 시도
        router.push("/creating_diary_v2/CompleteScreen");
      }

    } catch (error) {
      console.error("다이어리 저장 실패:", error);
      setLoadingMessage("오류가 발생했습니다. 다시 시도해주세요.");
      
      // 에러 발생 시 3초 후 이전 화면으로 돌아가기
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.safeArea}>
      <Header />
      
      <View style={styles.container}>
        {/* 로딩 스피너 */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={colors.BLUE} 
            style={styles.spinner}
          />
          
          {/* 로딩 메시지 */}
          <CustomMediumText style={styles.loadingText}>
            {loadingMessage}
          </CustomMediumText>
          
          {/* 진행 상태 표시 */}
          <CustomText style={styles.statusText}>
            잠시만 기다려주세요...
          </CustomText>
        </View>

        {/* 데이터 미리보기 (개발용) */}
        <View style={styles.debugContainer}>
          <CustomText style={styles.debugTitle}>전송할 데이터:</CustomText>
          <CustomText style={styles.debugText}>스토어 폴더 ID: {folderId}</CustomText>
          <CustomText style={styles.debugText}>URL 폴더 ID: {urlFolderId}</CustomText>
          <CustomText style={styles.debugText}>최종 폴더 ID: {folderId || urlFolderId}</CustomText>
          <CustomText style={styles.debugText}>날짜: {date}</CustomText>
          <CustomText style={styles.debugText}>공개 범위: {visibility}</CustomText>
          <CustomText style={styles.debugText}>감정: {emotions.join(', ')}</CustomText>
          <CustomText style={styles.debugText}>이미지 수: {images.size}개</CustomText>
        </View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: colors.DARK_GRAY,
    textAlign: 'center',
  },
  debugContainer: {
    backgroundColor: colors.LIGHT_GRAY,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: colors.DARK_GRAY,
    marginBottom: 4,
  },
});

export const options = {
  headerShown: false,
}; 