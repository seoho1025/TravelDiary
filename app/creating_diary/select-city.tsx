/* import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDiaryCreateStore } from '../../stores/diaryCreateStore';
import cities from './cities_ko'; // cities_ko.ts로 변경하여 import

// 해당 나라의 도시를 선택해서 넘겨주면 더 정확할 것 같아서 구성한 페이지
// sprint1에서 결과가 안 좋으면 추가할 예정, 아직 완벽 완성된 페이지는 아님
export default function SelectCity() {
  const country = useDiaryCreateStore(state => state.country); // 나라 이름(한글)
  const setCity = useDiaryCreateStore(state => state.setCity);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  // cities_ko에서 해당 나라의 도시 리스트 가져오기
  const cityList: string[] = country && cities[country] ? cities[country] : [];

  const handleComplete = () => {
    if (selected) {
      setCity(selected);
      // 다음 단계로 이동 (예: 해시태그 선택 등)
      router.push('../creating_diary/select-hashtag');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{country}의 도시를 선택해 주세요</Text>
          {cityList.length === 0 ? (
            <Text style={{ color: 'red', marginTop: 40 }}>도시 정보가 없습니다.</Text>
          ) : (
            <FlatList
              data={cityList}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.cityRow, selected === item && styles.selectedRow]}
                  onPress={() => setSelected(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cityName, selected === item && styles.selectedText]}>{item}</Text>
                </TouchableOpacity>
              )}
              style={{ flex: 1, width: '100%' }}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, !selected && { backgroundColor: '#B0B8C1' }]}
          disabled={!selected}
          onPress={handleComplete}
        >
          <Text style={styles.buttonText}>완료</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 4,
  },
  selectedRow: {
    backgroundColor: '#E6EDFF',
  },
  cityName: {
    fontSize: 18,
    color: '#444',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#4263EB',
  },
  button: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#3E69EE',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); */

export default function Placeholder() {
  return null;
}