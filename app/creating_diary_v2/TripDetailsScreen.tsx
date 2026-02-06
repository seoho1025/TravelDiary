import CustomMediumText from "@/components/CustomMediumText";
import CustomText from "@/components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Header from '../../components/Header';
import { colors } from '../../constants/Colors';
import { useDiaryCreateStorev2 } from '../../store/DiaryCreateStorev2';
import { useFolderListStore } from '../../store/FolderListStore';
import { useDiaryFormStore } from '../../store/useDiaryFormStore';

SplashScreen.preventAutoHideAsync();

export default function TravelPhotoSelectScreen() {
  const [showDayModal, setShowDayModal] = useState(false);
  const [photos, setPhotos] = useState<{ id: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setImageBase64 } = useDiaryFormStore();
  
  // URL 파라미터에서 폴더 ID 가져오기
  const params = useLocalSearchParams();
  const folderId = params.folderId as string;
  
  // 새로운 스토어 사용
  const {
    images,
    visibility,
    selectedDay,
    date,
    emotions,
    toggleImage,
    setVisibility,
    setSelectedDay,
    setDate,
    setFolderId,
    setImages,
    setEmotions,
    reset,
  } = useDiaryCreateStorev2();
  
  // 폴더 정보 가져오기
  const folders = useFolderListStore(state => state.folders);
  const selectedFolder = folders.find(folder => folder.folderId.toString() === folderId);

  // 디버깅용 로그
  console.log("=== TripDetailsScreen 디버깅 정보 ===");
  console.log("받은 params:", params);
  console.log("받은 folderId:", folderId);
  console.log("folderId 타입:", typeof folderId);
  console.log("전체 폴더 목록:", folders);
  console.log("선택된 폴더:", selectedFolder);
  console.log("현재 스토어 상태:", { images: images.size, visibility, selectedDay, date, emotions, folderId: useDiaryCreateStorev2.getState().folderId });
  console.log("photos 배열:", photos);
  console.log("선택된 이미지들:", Array.from(images));
  console.log("=====================================");
  
  // 폴더 ID를 스토어에 저장
  useEffect(() => {
    if (folderId) {
      console.log("폴더 ID를 스토어에 설정:", folderId);
      // 이전 폴더의 정보를 완전히 초기화하고 새로운 폴더 ID 설정
      setImages(new Set()); // 이미지 초기화
      setEmotions([]); // 감정 초기화
      setSelectedDay(null); // 선택된 일차 초기화
      setDate(null); // 날짜 초기화
      setVisibility('public'); // 공개 범위 초기화
      setFolderId(folderId); // 새로운 폴더 ID 설정
      console.log("스토어 완전 초기화 완료, 새로운 폴더 ID 설정:", folderId);
    }
  }, [folderId, setFolderId, setImages, setEmotions, setSelectedDay, setDate, setVisibility]);

  // 여행 기간 계산
  const calculateTripDays = () => {
    if (!selectedFolder || !selectedFolder.startDate || !selectedFolder.endDate) {
      return 30; // 기본값: 30일
    }

    const startDate = new Date(selectedFolder.startDate);
    const endDate = new Date(selectedFolder.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 시작일 포함
    
    return Math.min(diffDays, 30); // 최대 30일로 제한
  };

  // 여행 기간에 맞는 일차 옵션 생성
  const tripDays = calculateTripDays();
  const dayOptions = Array.from({ length: tripDays }, (_, i) => i + 1);

  // 일차를 실제 날짜로 변환하는 함수
  const getDateFromDay = (day: number): string | null => {
    console.log("getDateFromDay 호출:", { day, selectedFolder });
    
    if (!selectedFolder || !selectedFolder.startDate) {
      console.log("폴더 정보 없음");
      return null;
    }

    const startDate = new Date(selectedFolder.startDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + (day - 1)); // 1일차는 시작일, 2일차는 시작일+1일

    const result = targetDate.toISOString().split('T')[0];
    console.log("날짜 변환 결과:", { startDate: selectedFolder.startDate, day, result });
    
    // YYYY-MM-DD 형식으로 반환
    return result;
  };

  // 일차 선택 시 실제 날짜로 변환해서 저장
  const handleDaySelection = (day: number) => {
    console.log("일차 선택됨:", day);
    const actualDate = getDateFromDay(day);
    console.log("변환된 실제 날짜:", actualDate);
    
    if (actualDate) {
      setSelectedDay(day);
      setDate(actualDate); // 실제 날짜를 스토어에 저장
      console.log(`선택된 일차: ${day}일차, 실제 날짜: ${actualDate}`);
      console.log("스토어에 저장된 날짜 확인:", { selectedDay: day, date: actualDate });
    } else {
      console.log("날짜 변환 실패");
    }
    setShowDayModal(false);
  };

  // 반응형 이미지 크기 계산
  const windowWidth = Dimensions.get("window").width;
  const gridPadding = 20; // styles.container paddingHorizontal
  const gridGap = 2; // 이미지 사이 gap
  const numColumns = 4;
  const imageSize = Math.floor(
    (windowWidth - gridPadding * 2 - gridGap * (numColumns - 1)) / numColumns,
  );

  useEffect(() => {
    (async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          // Expo Go에서는 전체 앨범 접근이 제한되므로, 기본 사진첩만 접근
          const assets = await MediaLibrary.getAssetsAsync({
            mediaType: "photo",
            first: 8,
            sortBy: [["creationTime", false]],
          });
          
          const photoInfos = await Promise.all(
            assets.assets.map(async (asset) => {
              const info = await MediaLibrary.getAssetInfoAsync(asset.id);
              return { id: asset.id, uri: info.localUri || asset.uri };
            }),
          );
          setPhotos(photoInfos);
        } else {
          console.log("Permission to access media library was denied");
        }
      } catch (error) {
        console.log("Error accessing media library:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 라이브러리에서 직접 사진 선택
  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("사진첩 접근 권한이 필요합니다.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true, // 여러장 선택 가능
      selectionLimit: 8, // 최대 8장까지 선택 가능
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhotos = result.assets.map((asset, index) => ({
        id: `picked-${Date.now()}-${index}`,
        uri: asset.uri,
      }));
      
      // 기존 사진과 새로 선택한 사진을 합치되, 최대 8장까지만 유지
      setPhotos(prev => {
        const combined = [...newPhotos, ...prev];
        return combined.slice(0, 8);
      });
      
      // 새로 추가된 사진들을 선택 상태로 설정
      const newSelectedUris = new Set(newPhotos.map(photo => photo.uri));
      // 스토어에서 선택된 사진 관리
      newSelectedUris.forEach(uri => toggleImage(uri));
    }
  };

  const handleNext = async () => {
    if (images.size === 0) {
      Alert.alert("알림", "사진을 선택해주세요.");
      return;
    }
    router.push("./EmotionScreen");
  };

  return (
    <View style={styles.safeArea}>
      <Header />
      
      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: "33.33%" }]} />
        </View>
        <CustomMediumText style={styles.progressText}>1/3</CustomMediumText>
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Title */}
        <CustomMediumText style={styles.title}>
          이 기억을 가장 잘 표현하는 시간과 상황은{"\n"}무엇인가요?
        </CustomMediumText>
        {/* Image Grid */}
        <View style={[styles.imageGrid, { marginBottom: 10 }]}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.BLUE}
              style={{ flex: 1, marginVertical: 40 }}
            />
          ) : (
            Array.from({ length: 8 }).map((_, idx) => {
              const photo = photos[idx];
              return (
                <TouchableOpacity
                  key={photo ? photo.id : `empty-${idx}`}
                  style={[
                    styles.imageWrapper,
                    {
                      width: imageSize,
                      height: imageSize,
                      marginRight: (idx + 1) % numColumns === 0 ? 0 : gridGap,
                      marginBottom: idx < 4 ? gridGap : 0,
                    },
                    photo && images.has(photo.uri) && styles.selectedImageWrapper,
                  ]}
                  onPress={() => photo && toggleImage(photo.uri)}
                  activeOpacity={photo ? 0.8 : 1}
                  disabled={!photo}
                >
                  {photo ? (
                    <Image source={{ uri: photo.uri }} style={styles.image} />
                  ) : (
                    <View style={styles.emptyImage} />
                  )}
                  {photo && images.has(photo.uri) && (
                    <>
                      <View style={styles.checkOverlay}>
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color={colors.BLUE}
                        />
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
        {/* 라이브러리에서 직접 사진 선택 버튼 */}
        <TouchableOpacity
          style={styles.libraryButton}
          onPress={pickImageFromLibrary}
        >
          <CustomMediumText style={styles.libraryButtonText}>
            라이브러리에서 직접 사진 선택
          </CustomMediumText>
        </TouchableOpacity>

        {/* 공개 범위 설정 */}
        <CustomMediumText style={styles.sectionLabel}>공개 범위</CustomMediumText>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={[styles.radioButton, visibility === 'public' && styles.radioButtonSelected]}
            onPress={() => setVisibility('public')}
          >
            <View style={[styles.radioCircle, visibility === 'public' && styles.radioCircleSelected]} />
            <CustomText style={styles.radioText}>전체 공개</CustomText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.radioButton, visibility === 'private' && styles.radioButtonSelected]}
            onPress={() => setVisibility('private')}
          >
            <View style={[styles.radioCircle, visibility === 'private' && styles.radioCircleSelected]} />
            <CustomText style={styles.radioText}>비공개</CustomText>
          </TouchableOpacity>
        </View>

        {/* 일차 선택 */}
        <CustomMediumText style={styles.sectionLabel}>일차</CustomMediumText>
        <TouchableOpacity 
          style={styles.dateSelector}
          onPress={() => setShowDayModal(true)}
        >
          <CustomMediumText style={[
            styles.dateSelectorText, 
            selectedDay ? styles.dateSelectorTextSelected : null
          ]}>
            {selectedDay ? `${selectedDay}일차` : '선택'}
          </CustomMediumText>
          <Ionicons name="chevron-down" size={20} color={colors.GRAY_400} />
        </TouchableOpacity>

        {/* 일차 선택 모달 */}
        <Modal
          visible={showDayModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDayModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDayModal(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <CustomMediumText style={styles.modalTitle}>
                  일차 선택
                </CustomMediumText>
                <TouchableOpacity onPress={() => setShowDayModal(false)}>
                  <Ionicons name="close" size={24} color={colors.DARKER_GRAY} />
                </TouchableOpacity>
              </View>
              {selectedFolder ? (
                <FlatList
                  data={dayOptions}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dayOption,
                        selectedDay === item && styles.dayOptionSelected
                      ]}
                      onPress={() => handleDaySelection(item)}
                    >
                      <CustomText style={[
                        styles.dayOptionText,
                        selectedDay === item && styles.dayOptionTextSelected
                      ]}>
                        {item}일차
                      </CustomText>
                      {selectedDay === item && (
                        <Ionicons name="checkmark" size={20} color={colors.BLUE} />
                      )}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noFolderContainer}>
                  <CustomText style={styles.noFolderText}>
                    폴더 정보를 찾을 수 없습니다.{'\n'}
                    먼저 여행 폴더를 생성해주세요.
                  </CustomText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <CustomMediumText style={styles.nextButtonText}>다음</CustomMediumText>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
    color: colors.BLACK,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 28,
    marginTop: 40,
  },
  selectedCountContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedCountText: {
    fontSize: 14,
    color: colors.GRAY_400,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minHeight: 2 * 80 + 6, // 최소 2행 보장
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
    backgroundColor: colors.GRAY_100,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImageWrapper: {
    borderColor: colors.BLUE,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyImage: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.GRAY_200,
  },
  checkOverlay: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: colors.WHITE_TRANSPARENT,
    borderRadius: 16,
  },
  libraryButton: {
    backgroundColor: colors.WHITE,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.BLUE,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    marginBottom: 10,
  },
  libraryButtonText: {
    color: colors.BLUE,
    fontSize: 15,
  },
  sectionLabel: {
    marginTop: 46,
    marginBottom: 12,
    color: colors.DARKER_GRAY,
    fontSize: 19,
  },
  radioGroup: { 
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 40,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioButtonSelected: {
    // 배경색 제거
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.GRAY_400,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.BLUE,
    backgroundColor: colors.BLUE,
  },
  radioText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 8,
    backgroundColor: colors.WHITE,
  },
  dateSelectorText: {
    fontSize: 16,
    color: colors.GRAY_400,
  },
  dateSelectorTextSelected: {
    color: colors.BLACK,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: colors.DARKER_GRAY,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.GRAY_400,
    marginTop: 4,
  },
  dayOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  dayOptionSelected: {
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 8,
  },
  dayOptionText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  dayOptionTextSelected: {
    color: colors.BLUE,
  },
  noFolderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noFolderText: {
    fontSize: 16,
    color: colors.GRAY_400,
    textAlign: 'center',
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: colors.BLUE,
    borderRadius: 40,
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 32,
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
