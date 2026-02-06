import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { useDiaryCreateStore } from '../../stores/diaryCreateStore';
// 해시태그 선택 페이지. 추후 이미지 업로드 페이지 뒤로 이어질 예정임

// 태그 목록 배열
const HASHTAG_ROWS = [
  ["#국내 여행", "#해외 여행", "#도시 여행"],
  ["#바다 여행", "#산악 여행", "#촌캉스"],
  ["#힐링 여행", "#유명지 여행", "#호캉스"],
  ["#등산", "#캠핑", "#자전거 여행"],
  ["#트레킹", "#스키", "#휴식"],
  ["#서핑", "#명상"],
  ["#박물관 투어", "#유적지 탐방", "#거리 공연"],
  ["#자연풍경", "#축제", "#테마파크"],
  ["#맛집 탐방", "#디저트 투어", "#음식 여행"],
  ["#현지 맛집", "#길거리 음식"],
  ["#봄여행", "#여름 여행", "#가을 여행"],
  ["#겨울 여행", "#주말 여행", "#연휴 여행"],
  ["#당일치기", "#장기 여행", "#한달 살이"]
];

// 해시태그 선택 페이지 컴포넌트
export default function SelectHashtag() {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  //const setHashtags = useDiaryCreateStore(state => state.setHashtags);
  //const hashtagsStore = useDiaryCreateStore(state => state.hashtags);

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter(t => t !== tag));
    } else if (selected.length < 3) {
      setSelected([...selected, tag]);
    } else {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}># 태그를 선택해주세요</Text>
        <View style={styles.selectedTagContainer}>
          {selected.length === 0 ? (
            <Text style={styles.selectedTagPlaceholder}>선택된 태그가 없습니다</Text>
          ) : (
            <View style={styles.selectedTagList}>
              {selected.map(tag => (
                <View key={tag} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => setSelected(selected.filter(t => t !== tag))}>
                    <Text style={styles.selectedTagRemove}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.tagList}>
          <View style={styles.tagWrap}>
            {HASHTAG_ROWS.map((row, index) => (
              <View
                key={index}
                style={[
                  styles.tagRow,
                  (index === 2 || index === 5 || index === 7 || index === 9 || index === 11) && { marginTop: 15 }
                ]}
              >
                {row.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selected.includes(tag) && styles.tagSelected
                    ]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.tagText,
                      selected.includes(tag) && styles.tagTextSelected
                    ]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.button,
            selected.length === 0 && { backgroundColor: '#B0B8C1' }
          ]}
          disabled={selected.length === 0}
          onPress={() => {
         //   setHashtags(selected);
            router.push('./select-country');
          }}
        >
          <Text style={styles.buttonText}>완료</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>태그는 최대 3개 입력 가능합니다.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4263EB',
    marginTop: 32,
    marginBottom: 24,
    textAlign: 'center',
  },
  tagList: {
    alignItems: 'flex-start',
    marginBottom: 120,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  tag: {
    borderWidth: 1,
    borderColor: '#B0B8C1',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  tagSelected: {
    backgroundColor: '#3E69EE',
    borderColor: '#3E69EE',
  },
  tagText: {
    color: '#444',
    fontSize: 15,
  },
  tagTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3E69EE',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: 280,
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#3E69EE',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedTagContainer: {
    minHeight: 40,
    marginBottom: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  selectedTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EDFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: '#4263EB',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  selectedTagRemove: {
    color: '#4263EB',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  selectedTagPlaceholder: {
    color: '#B0B8C1',
    fontSize: 15,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});