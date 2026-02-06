import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/CustomText';
import countries from '../../scripts/countries.json';
import { useDiaryFormStore } from '../../store/useDiaryFormStore';

export default function SelectCountry() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const setLocation = useDiaryFormStore(state => state.setLocation);
  const filtered = countries.filter(c => c.name.includes(search));

  const handleComplete = () => {
    if (selected) {
      // 코드로 name 찾아 zustand에 저장
      const countryObj = countries.find(c => c.code === selected);
      if (countryObj) {
        setLocation(countryObj.name); // location에만 저장
      }
      router.push('/creating_diary/photo');
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CustomText style={styles.title}>여행한 장소를 선택해 주세요</CustomText>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="나라를 검색해 주세요"
              placeholderTextColor="#B0B8C1"
              value={search}
              onChangeText={setSearch}
            />
            <Ionicons name="search" size={22} color="#8C8C8C" style={styles.searchIcon} />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryRow}
                onPress={() => setSelected(item.code)}
                activeOpacity={0.7}
              >
                <View style={styles.radioOuter}>
                  {selected === item.code && <View style={styles.radioInner} />}
                </View>
                <Image source={{ uri: item.flag }} style={styles.flag} />
                <CustomText style={styles.countryName}>{item.name}</CustomText>
              </TouchableOpacity>
            )}
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, !selected && { backgroundColor: '#B0B8C1' }]}
          disabled={!selected}
          onPress={handleComplete}
        >
          <CustomText style={styles.buttonText}>완료</CustomText>
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  searchIcon: {
    marginLeft: 4,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 4,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B0B8C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3E69EE',
  },
  flag: {
    width: 32,
    height: 22,
    borderRadius: 4,
    marginRight: 16,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#eee',
  },
  countryName: {
    fontSize: 18,
    color: '#444',
    fontWeight: 'bold',
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
}); 