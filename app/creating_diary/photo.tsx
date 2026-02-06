import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import { useFonts } from "expo-font";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { colors } from '../../constants/Colors';
import { useDiaryFormStore } from '../../store/useDiaryFormStore';

SplashScreen.preventAutoHideAsync();

const weatherIcons = [
  { src: require('../../assets/images/Sun.png'), value: '맑음' },
  { src: require('../../assets/images/Cloud.png'), value: '흐림' },
  { src: require('../../assets/images/Rainy.png'), value: '비' },
  { src: require('../../assets/images/Snowy.png'), value: '눈' },
];


export default function TravelPhotoSelectScreen() {
  const [fontsLoaded] = useFonts({
    NotoSansKR: require("../../assets/fonts/NotoSansKR-Regular.ttf"),
  });

  const [selected, setSelected] = useState<number | null>(0);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setImageBase64, setWeather } = useDiaryFormStore();

  // 반응형 이미지 크기 계산
  const windowWidth = Dimensions.get("window").width;
  const gridPadding = 20; // styles.container paddingHorizontal
  const gridGap = 6; // 이미지 사이 gap
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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setPhotos((prev) => [
        { id: `picked-${Date.now()}`, uri: result.assets[0].uri },
        ...prev.slice(0, 7),
      ]);
      setSelected(0);
    }
  };

  const handleNext = async () => {
    if (!photos[selected || 0]) {
      Alert.alert("알림", "사진을 선택해주세요.");
      return;
    }
    if (!selectedWeather) {
      Alert.alert("알림", "날씨를 선택해주세요.");
      return;
    }

    // 선택된 사진을 리사이즈 및 압축 후 base64로 변환
    const selectedPhoto = photos[selected || 0];
    if (selectedPhoto) {
      try {
        // 800px로 리사이즈, 0.7로 압축
        const manipResult = await ImageManipulator.manipulateAsync(
          selectedPhoto.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: FileSystem.EncodingType.Base64 });
        setImageBase64(`data:image/jpeg;base64,${base64}`);
      } catch (e) {
        Alert.alert("이미지 변환 실패", "이미지 파일을 변환하는 데 실패했습니다.");
        return;
      }
    }
    setWeather(selectedWeather);
    router.push("/creating_diary/companion");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.DARKER_GRAY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRAVEL DIARY</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.headerHr} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Progress Bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: "33.33%" }]} />
          </View>
          <Text style={styles.progressText}>1/3</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          이 기억을 가장 잘 표현하는 시간과 상황은{"\n"}무엇인가요?
        </Text>

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
                    selected === idx && styles.selectedImageWrapper,
                  ]}
                  onPress={() => photo && setSelected(idx)}
                  activeOpacity={photo ? 0.8 : 1}
                  disabled={!photo}
                >
                  {photo ? (
                    <Image source={{ uri: photo.uri }} style={styles.image} />
                  ) : (
                    <View style={styles.emptyImage} />
                  )}
                  {selected === idx && photo && (
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
          <Text style={styles.libraryButtonText}>
            라이브러리에서 직접 사진 선택
          </Text>
        </TouchableOpacity>

        {/* 날씨 선택 (이미지 아이콘만 보임) */}
        <Text style={styles.sectionLabel}>날씨</Text>
        <View style={styles.weatherRow}>
          {weatherIcons.map((w, idx) => (
            <TouchableOpacity
              key={w.value}
              style={[
                styles.weatherIconWrapper,
                selectedWeather === w.value && styles.weatherIconSelected,
              ]}
              onPress={() => setSelectedWeather(w.value)}
              activeOpacity={0.8}
            >
              <Image source={w.src} style={styles.weatherIcon} />
            </TouchableOpacity>
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
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: colors.BLACK,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 28,
    marginTop: 48,
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
    fontWeight: "bold",
    fontSize: 15,
  },
  selectedCount: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: colors.BLUE,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedCountText: {
    color: colors.WHITE_RGB,
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionLabel: {
    marginTop: 46,
    marginBottom: -4,
    fontWeight: "bold",
    color: colors.DARKER_GRAY,
    fontSize: 19,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 56,
    marginBottom: 36,
    gap: 24,
  },
  weatherIconWrapper: {
    borderRadius: 16,
    padding: 8,
    backgroundColor: 'transparent',
  },
  weatherIconSelected: {
    backgroundColor: colors.WHITE_RGB,
    borderWidth: 2,
    borderColor: colors.BLUE,
  },
  weatherIcon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
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
    fontWeight: 'bold',
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.WHITE,
    justifyContent: "space-between",
    position: 'relative',
    zIndex: 1,
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
});

export const options = {
  headerShown: false,
};
