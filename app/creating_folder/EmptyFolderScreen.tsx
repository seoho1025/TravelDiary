import CustomMediumText from '@/components/CustomMediumText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import CustomText from '../../components/CustomText';
import Header from '../../components/Header';
import { colors } from '../../constants/Colors';
import { useDiaryStore } from '../../store/DiaryStore';
import { useFolderListStore } from '../../store/FolderListStore';

export default function EmptyFolderScreen() {
  const router = useRouter();
  
  // 폴더 스토어에서 API 관련 상태들 개별적으로 가져오기
  const folders = useFolderListStore(state => state.folders); // 폴더 목록
  const isLoading = useFolderListStore(state => state.isLoading); // 로딩 상태
  const error = useFolderListStore(state => state.error); // 에러 상태
  const fetchFolders = useFolderListStore(state => state.fetchFolders); // 폴더 목록 가져오기
  
  const getDiariesByFolderId = useDiaryStore(state => state.getDiariesByFolderId); // 폴더 ID로 일기 목록 가져오기
  const fetchFolderDetail = useFolderListStore(state => state.fetchFolderDetail); // 폴더 상세 조회

  // fetchFolders를 useCallback으로 감싸서 안정적인 참조 생성
  const stableFetchFolders = useCallback(() => {  
    fetchFolders();
  }, [fetchFolders]);

  // 컴포넌트 마운트 시 폴더 목록 가져오기
  useEffect(() => {
    console.log('EmptyFolderScreen 마운트됨');
    
    // 서버에서 폴더 목록 가져오는 함수인 fetchFolders 호출
    stableFetchFolders();
    console.log('현재 로컬 폴더 목록:', folders);
  }, [stableFetchFolders]);

  // 폴더 목록 상태 확인
  useEffect(() => {
    console.log('현재 폴더 목록:', folders);
    console.log('폴더 개수:', folders.length);
  }, [folders]);

  const handleCreateNewFolder = () => {
    router.push('../(tabs)/diary');
  };

  // 날짜 형식 변환 함수
  const formatDateRange = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startFormatted = start.toISOString().split('T')[0].replace(/-/g, '-');
      const endFormatted = end.toISOString().split('T')[0].replace(/-/g, '-');
      return `${startFormatted} ~ ${endFormatted}`;
    } else if (startDate) {
      const start = new Date(startDate);
      const startFormatted = start.toISOString().split('T')[0].replace(/-/g, '-');
      return `${startFormatted}`;
    }
    return '날짜를 선택해주세요';
  };

  const renderFolderItem = ({ item }: { item: any }) => {
    // 해당 폴더에 포함된 일기 개수 가져오기
    const diariesInFolder = getDiariesByFolderId(item.folderId.toString());
    const diaryCount = diariesInFolder.length;
    
    console.log(`=== 폴더 "${item.title}" (ID: ${item.folderId}) 렌더링 ===`);
    console.log("폴더 ID (문자열):", item.folderId.toString());
    console.log("폴더 ID (숫자):", item.folderId);
    console.log("해당 폴더의 일기들:", diariesInFolder);
    console.log("일기 개수:", diaryCount);
    
    // 전체 일기 목록 확인
    const allDiaries = useDiaryStore.getState().diaries;
    console.log("전체 일기 목록:", allDiaries);
    console.log("전체 일기 개수:", allDiaries.length);
    
    // 폴더 API의 image 필드를 우선 사용, 없으면 일기의 첫 번째 이미지 사용
    const folderImage = item.image || (diaryCount > 0 && diariesInFolder[0]?.images?.length > 0 
      ? diariesInFolder[0].images[0] 
      : null);
    
    return (
      <TouchableOpacity 
        style={styles.folderCard} 
        activeOpacity={0.8} 
        onPress={async () => {
          console.log("폴더 클릭됨:", item);
          console.log("폴더 ID:", item.folderId);
          console.log("일기 개수:", diaryCount);
          
          // 로컬에 일기가 있으면 바로 사용, 없으면 서버에서 조회
          if (diaryCount > 0) {
            try {
              console.log("=== 폴더 클릭 처리 시작 (로컬 데이터 있음) ===");
              console.log("폴더 상세 조회 API 호출");
              const folderDetail = await fetchFolderDetail(item.folderId.toString());
              console.log("폴더 상세 조회 성공:", folderDetail);
              
              // 첫 번째 일기의 상세 화면으로 이동 (API 데이터와 함께)
              const firstDiary = diariesInFolder[0];
              console.log("API 데이터와 함께 일기 상세 화면으로 이동");
              router.push(`../creating_diary_v2/DiaryDetailScreen?diaryId=${firstDiary.id}&folderId=${item.folderId}&apiData=${encodeURIComponent(JSON.stringify(folderDetail))}`);
            } catch (error) {
              console.log("=== 폴더 상세 조회 실패, 로컬 데이터 사용 ===");
              console.log("에러:", error);
              console.log("로컬 일기 데이터 사용");
              
              // API 실패 시 로컬 데이터 사용
              const firstDiary = diariesInFolder[0];
              console.log("로컬 데이터로 일기 상세 화면 이동");
              router.push(`../creating_diary_v2/DiaryDetailScreen?diaryId=${firstDiary.id}&folderId=${item.folderId}`);
            }
          } else {
            // 로컬에 일기가 없으면 서버에서 조회해보기
            console.log("=== 로컬에 일기 없음, 서버에서 조회 시도 ===");
            try {
              console.log("폴더 상세 조회 API 호출");
              const folderDetail = await fetchFolderDetail(item.folderId.toString());
              console.log("폴더 상세 조회 성공:", folderDetail);
              
              // 서버에서 일기를 받았으면 일기 상세 화면으로 이동
              if (folderDetail && folderDetail.diaries && folderDetail.diaries.length > 0) {
                console.log("서버에서 일기 발견, 일기 상세 화면으로 이동");
                const firstDiary = folderDetail.diaries[0];
                router.push(`../creating_diary_v2/DiaryDetailScreen?diaryId=${firstDiary.diaryId}&folderId=${item.folderId}&apiData=${encodeURIComponent(JSON.stringify(folderDetail))}`);
              } else {
                console.log("서버에도 일기 없음, 일기 생성 화면으로 이동");
                router.push(`../creating_diary_v2/TripDetailsScreen?folderId=${item.folderId}`);
              }
            } catch (error) {
              console.log("=== 서버 조회 실패, 일기 생성 화면으로 이동 ===");
              console.log("에러:", error);
              router.push(`../creating_diary_v2/TripDetailsScreen?folderId=${item.folderId}`);
            }
          }
        }}
      >
        <View style={styles.cardTopSection}>
          {folderImage ? (
            // 폴더 이미지 또는 일기 이미지 표시
            <Image 
              source={{ uri: folderImage }} 
              style={styles.folderImage}
              resizeMode="cover"
            />
          ) : (
            // 이미지가 없는 경우: 플러스 아이콘 표시
            <View style={styles.plusIconContainer}>
              <View style={styles.plusIcon}>
                <Ionicons name="add" size={32} color={colors.WHITE} />
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.cardBottomSection}>
          <CustomMediumText style={styles.folderTitle}>
            {item.title}
          </CustomMediumText>
          
          <CustomText style={styles.dateRange}>
            {formatDateRange(item.startDate, item.endDate)}
          </CustomText>
          
          {/* 태그 표시 (폴더 API의 tag 사용) */}
          {item.tag && item.tag.length > 0 && (
            <View style={styles.tagContainer}>
              {item.tag.slice(0, 2).map((tag: string, index: number) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // 로딩 상태
  if (isLoading && folders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.BLUE} />
        <Text style={styles.loadingText}>폴더 목록을 불러오는 중...</Text>
      </View>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>오류가 발생했습니다: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={stableFetchFolders}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header/>
      
      <View style={styles.content}>
        {folders.length === 0 ? (
          // 폴더가 없을 때
          <View style={styles.emptyContainer}>
            <CustomMediumText style={styles.emptyTitle}>
              아직 여행 폴더가 없어요
            </CustomMediumText>
            <CustomText style={styles.emptySubtitle}>
              첫 번째 여행을 기록해보세요
            </CustomText>
            
            <TouchableOpacity style={styles.createButton} onPress={handleCreateNewFolder}>
              <CustomMediumText style={styles.createButtonText}>
                여행 폴더 만들기
              </CustomMediumText>
            </TouchableOpacity>
          </View>
        ) : (
          // 폴더가 있을 때
          <View>
            <CustomMediumText style={styles.title}>
              이번 여행, 어떤 이야기로 채워질까요?
            </CustomMediumText>
          <FlatList
            data={folders}
            renderItem={renderFolderItem}
            keyExtractor={(item) => item.folderId.toString()}
            contentContainerStyle={styles.folderList}
            showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
      
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    color: colors.DARK_GRAY,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.TEXT_GRAY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.DARK_GRAY,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.BLUE,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 200,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
    marginBottom: 40,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: colors.BLUE,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  folderList: {
    paddingVertical: 20,
    paddingBottom: 120,
  },
  folderCard: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTopSection: {
    height: 100,
    backgroundColor: colors.GRAY_100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderImage: {
    width: '100%',
    height: '100%',
     borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  plusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottomSection: {
    padding: 20,
  },
  folderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    fontSize: 12,
    color: colors.BLUE,
    backgroundColor: colors.LIGHT_BLUE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  diaryCount: {
    fontSize: 14,
    color: colors.BLUE,
    fontWeight: '600',
  },
});
