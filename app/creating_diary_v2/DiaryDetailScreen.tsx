import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import CustomMediumText from '../../components/CustomMediumText';
import CustomText from '../../components/CustomText';
import Header from '../../components/Header';
import { colors } from '../../constants/Colors';
import { useDiaryStore } from '../../store/DiaryStore';

interface DiaryDetail {
  id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
  emotions: string[];
  isLoading?: boolean;
}

export default function DiaryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const diaryId = params.diaryId as string;
  const folderId = params.folderId as string;
  const apiDataParam = params.apiData as string;
  
  const getDiariesByFolderId = useDiaryStore(state => state.getDiariesByFolderId);
  const diariesInFolder = getDiariesByFolderId(folderId);
  
  // 화면 너비 가져오기
  const screenWidth = Dimensions.get('window').width;
  
  // 카드 높이 상태 관리
  const [cardHeights, setCardHeights] = useState<{ [key: string]: number }>({});

  // 카드 높이 측정 함수
  const handleCardLayout = (diaryId: string, event: any) => {
    const { height } = event.nativeEvent.layout;
    setCardHeights(prev => ({
      ...prev,
      [diaryId]: height
    }));
  };

  // 노트북 줄 개수 계산 함수
  const getNotebookLinesCount = (diaryId: string) => {
    const cardHeight = cardHeights[diaryId];
    if (!cardHeight) return 12; // 기본값
    
    // 카드 높이에서 패딩(40px)과 이미지 높이(250px)를 뺀 후 28px 간격으로 나누기
    const contentHeight = cardHeight - 40 - 250; // 패딩 20px * 2 + 이미지 높이
    const linesCount = Math.floor(contentHeight / 28);
    
    return Math.max(8, Math.min(linesCount, 25)); // 최소 8개, 최대 25개
  };
  
  // API 데이터 파싱
  const apiData = useMemo(() => {
    console.log('=== API 데이터 파싱 시작 ===');
    console.log('apiDataParam:', apiDataParam);
    
    if (apiDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(apiDataParam));
        console.log('API 데이터 파싱 성공:', parsedData);
        return parsedData;
      } catch (error) {
        console.error('API 데이터 파싱 실패:', error);
        console.log('로컬 데이터 사용으로 전환');
        return null;
      }
    }
    console.log('API 데이터 없음, 로컬 데이터 사용');
    return null;
  }, [apiDataParam]);
  
  // API 데이터가 있으면 API 데이터 사용, 없으면 로컬 데이터 사용
  const sortedDiaries = useMemo(() => {
    console.log('=== 일기 데이터 처리 시작 ===');
    console.log('apiData:', apiData);
    console.log('diariesInFolder:', diariesInFolder);
    console.log('folderId:', folderId);
    
    // API 데이터가 있으면 API 데이터 우선 사용
    if (apiData && apiData.diaries) {
      console.log('API 데이터에서 일기 목록 사용');
      
      // API 데이터의 diaries가 비어있으면 빈 배열 반환
      if (!Array.isArray(apiData.diaries) || apiData.diaries.length === 0) {
        console.log('API 데이터의 diaries가 비어있음');
        return [];
      }
      
      // API 데이터를 Diary 인터페이스에 맞게 변환
      const apiDiaries = apiData.diaries
        .map((diary: any, index: number) => {
          console.log(`API 일기 ${index + 1} 처리:`, diary);
          
          // travelDate를 기반으로 일차 계산
          const startDate = new Date(apiData.startDate);
          const travelDate = new Date(diary.travelDate);
          const dayDiff = Math.floor((travelDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          const convertedDiary = {
            id: diary.diaryId.toString(),
            folderId: folderId,
            date: diary.travelDate,
            title: diary.title,
            content: diary.content || '',
            images: diary.imageUrl ? [diary.imageUrl] : [],
            emotions: diary.emotions || [], // API에서는 emotions 정보가 없으므로 빈 배열
            day: dayDiff, // travelDate 기반으로 계산된 일차
            tags: diary.hashtags || [], // hashtags를 tags로 사용
            visibility: 'public' as const,
            createdAt: new Date().toISOString(),
          };
          
          console.log(`변환된 일기 ${index + 1}:`, convertedDiary);
          console.log(`이미지 정보:`, convertedDiary.images);
          return convertedDiary;
        })
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      console.log('API 일기 목록 완성:', apiDiaries);
      return apiDiaries;
    }
    
    // API 데이터가 없을 때만 로컬 데이터 사용
    if (diariesInFolder && diariesInFolder.length > 0) {
      console.log('로컬 데이터에서 일기 목록 사용');
      const localDiaries = diariesInFolder.map(diary => {
        console.log('로컬 일기 처리:', diary);
        console.log('로컬 일기 이미지:', diary.images);
        
        return {
          ...diary,
          day: 1, // 로컬 데이터는 기본값
          tags: (diary as any).tags || [], // tags가 있으면 사용, 없으면 빈 배열
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      console.log('로컬 일기 목록 완성:', localDiaries);
      console.log('로컬 일기 개수:', localDiaries.length);
      return localDiaries;
    }
    
    // 둘 다 없으면 빈 배열 반환
    console.log('로컬 데이터와 API 데이터 모두 없음');
    return [];
  }, [apiData, diariesInFolder, folderId]);
  
  // 현재 일기의 인덱스 찾기
  const currentIndex = useMemo(() => {
    return sortedDiaries.findIndex((diary: any) => diary.id === diaryId);
  }, [sortedDiaries, diaryId]);

  const handleEdit = () => {
    router.push({
      pathname: '/creating_diary_v2/TripDetailsScreen',
      params: { folderId: folderId }
    });
  };

  const renderDiaryItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.diaryContainer, { width: screenWidth }]}>
        <View>
            <CustomMediumText style={styles.dateText}>{item.date}</CustomMediumText>
        </View>
        {/* 통합된 카드 */}
        <View style={styles.unifiedCard}>
          {/* 상단 이미지 섹션 */}
          {item.images && item.images.length > 0 && (
            <View style={styles.imageSection}>
              <Image 
                source={{ uri: item.images[0] }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* 하단 내용 섹션 */}
          <View style={styles.contentSection}>
            {/* 공책 줄들 */}
            <View style={styles.notebookLines}>
              {Array.from({ length: 12 }).map((_, index) => (
                <View key={index} style={styles.line} />
              ))}
            </View>

            {/* 일기 제목 */}
            <CustomMediumText style={styles.diaryTitle}>
              {item.title}
            </CustomMediumText>

            {/* 일기 내용 */}
            <CustomText style={styles.content}>
              {item.content}
            </CustomText>

            {/* 해시태그 */}
            {item.emotions && item.emotions.length > 0 && (
              <View style={styles.hashtagContainer}>
                {item.emotions.map((emotion: string, index: number) => (
                  <CustomText key={index} style={styles.hashtag}>
                    #{emotion}
                  </CustomText>
                ))}
              </View>
            )}

            {/* 하단 액션 버튼 */}
            <View style={styles.actionSection}>
              <View style={styles.dayInfo}>
                <View style={styles.flagIcon}>
                  <Ionicons name="flag" size={16} color={colors.BLUE} />
                </View>
                <CustomText style={styles.dayText}>{item.day}일차</CustomText>
              </View>
              
              <TouchableOpacity style={styles.addButton} onPress={handleEdit}>
                <Ionicons name="add" size={24} color={colors.WHITE} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (sortedDiaries.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <CustomText style={styles.errorText}>일기를 찾을 수 없습니다.</CustomText>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.mainContainer}>
        <Header />
        
        <ScrollView 
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: screenWidth * sortedDiaries.length }}
        >
          {sortedDiaries.map((item: any, index: number) => (
            <View key={item.id} style={[styles.diaryContainer, { width: screenWidth }]}>
              <ScrollView 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 100 }}
                nestedScrollEnabled={true}
              >
                <View>
                  <CustomMediumText style={styles.dateText}>{item.date}</CustomMediumText>
                </View>
                
                {/* 통합된 카드 */}
                <View 
                  style={styles.unifiedCard}
                  onLayout={(event) => handleCardLayout(item.id, event)}
                >
                  {/* 상단 이미지 섹션 */}
                  {item.images && item.images.length > 0 && (
                    <View style={styles.imageSection}>
                      <Image 
                        source={{ 
                          uri: item.images[0].startsWith('file://') 
                            ? item.images[0] 
                            : `file://${item.images[0]}`
                        }} 
                        style={styles.mainImage}
                        resizeMode="cover"
                        onError={(error) => {
                          console.log('이미지 로딩 에러:', error);
                          console.log('이미지 URI:', item.images[0]);
                          console.log('처리된 URI:', item.images[0].startsWith('file://') 
                            ? item.images[0] 
                            : `file://${item.images[0]}`);
                        }}
                        onLoad={() => {
                          console.log('이미지 로딩 성공:', item.images[0]);
                        }}
                      />
                    </View>
                  )}

                  {/* 하단 내용 섹션 */}
                  <View style={styles.contentSection}>
                    {/* 공책 줄들 - 동적으로 계산 */}
                    <View style={styles.notebookLines}>
                      {Array.from({ length: getNotebookLinesCount(item.id) }).map((_, index) => (
                        <View key={index} style={styles.line} />
                      ))}
                    </View>

                    {/* 일기 제목 */}
                    <CustomMediumText style={styles.diaryTitle}>
                      {item.title}
                    </CustomMediumText>

                    {/* 일기 내용 */}
                    <CustomText style={styles.content}>
                      {item.content}
                    </CustomText>

                    {/* 해시태그 */}
                    {item.tags && item.tags.length > 0 && (
                      <View style={styles.hashtagContainer}>
                        {item.tags.map((tag: string, index: number) => (
                          <CustomText key={index} style={styles.hashtag}>
                            #{tag}
                          </CustomText>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* 하단 정보 */}
                  <View style={styles.dayInfo}>
                    <View style={styles.flagIcon}>
                      <Ionicons name="flag" size={16} color={colors.BLUE} />
                    </View>
                    <CustomText style={styles.dayText}>{item.day}일차</CustomText>
                  </View>

                  {/* 하단 액션 버튼 */}
                  <View style={styles.actionSection}>
                    <TouchableOpacity style={styles.addButton} onPress={handleEdit}>
                      <Ionicons name="add" size={24} color={colors.WHITE} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          ))}
        </ScrollView>

        <BottomTabBar activeTab="mydiary" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  container: {
    flex: 1,
  },
  diaryContainer: {
    width: '100%',
    backgroundColor: colors.WHITE,
    padding: 20,
    paddingBottom: 10, // 하단 탭바와의 간격을 위해 추가 패딩
  },
  unifiedCard: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 16,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageSection: {
    width: '100%',
    height: 250,
    backgroundColor: colors.WHITE,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    padding: 20,
    position: 'relative',
    flex: 1, // 내용에 따라 늘어나도록
    minHeight: 300, // 기본 내용 영역 높이
    paddingBottom: 80, // 하단 버튼과 겹치지 않도록 패딩 추가
  },
  dateText: {
    fontSize: 28,
    color: colors.DARK_GRAY,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 32,
  },
  diaryTitle: {
    fontSize: 20,
    color: colors.BLACK,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
  },
  content: {
    fontSize: 14,
    color: colors.BLACK,
    lineHeight: 32,
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    flexShrink: 0, // 텍스트가 잘리지 않도록
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40, // 하단 여백 증가
    position: 'relative',
    zIndex: 1,
  },
  hashtag: {
    fontSize: 14,
    color: colors.BLUE,
    marginRight: 8,
    marginBottom: 4,
    lineHeight: 32,
  },
  actionSection: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  dayInfo: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  flagIcon: {
    marginRight: 8,
  },
  dayText: {
    fontSize: 14,
    color: colors.DARK_GRAY,
    lineHeight: 32,
  },
  addButton: {
    backgroundColor: colors.BLUE,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    paddingTop: 300, // 위쪽 여백 추가
  },
  errorText: {
    fontSize: 16,
    color: colors.MID_GRAY,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.BLACK,
  },
  notebookLines: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    justifyContent: 'space-between',
    height: '100%', // 전체 높이 사용
  },
  line: {
    height: 1,
    backgroundColor: colors.LIGHT_GRAY,
    marginBottom: 28, // 28px 간격으로 수정
  },
}); 