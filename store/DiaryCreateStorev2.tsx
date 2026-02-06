import { create } from 'zustand';

interface DiaryCreateState {
  // 선택된 사진들 (인덱스 대신 URI 저장)
  images: Set<string>; // 이미지 URI들을 저장
  // 공개 범위
  visibility: 'public' | 'private';
  // 선택된 일차
  selectedDay: number | null;
  // 선택된 실제 날짜 (YYYY-MM-DD 형식)
  date: string | null;
  // 폴더 ID
  folderId: string | null;
  // 선택된 감정들
  emotions: string[];
  
  // 액션들
  setImages: (images: Set<string>) => void;
  addImage: (uri: string) => void;
  removeImage: (uri: string) => void;
  toggleImage: (uri: string) => void;
  
  setVisibility: (visibility: 'public' | 'private') => void;
  setSelectedDay: (day: number | null) => void;
  setDate: (date: string | null) => void;
  setFolderId: (id: string | null) => void;
  
  // 감정 관련 액션들
  setEmotions: (emotions: string[]) => void;
  addEmotion: (emotion: string) => void;
  removeEmotion: (emotion: string) => void;
  toggleEmotion: (emotion: string) => void;
  
  // 상태 초기화
  reset: () => void;
}

const initialState = {
  images: new Set<string>(),
  visibility: 'public' as const,
  selectedDay: null,
  date: null,
  folderId: null,
  emotions: [],
};

export const useDiaryCreateStorev2 = create<DiaryCreateState>((set, get) => ({
  ...initialState,

  // 사진 선택 관련 액션
  setImages: (images) => set({ images }),
  
  addImage: (uri) => set((state) => {
    const newSet = new Set(state.images);
    newSet.add(uri);
    return { images: newSet };
  }),
  
  removeImage: (uri) => set((state) => {
    const newSet = new Set(state.images);
    newSet.delete(uri);
    return { images: newSet };
  }),
  
  toggleImage: (uri) => set((state) => {
    const newSet = new Set(state.images);
    if (newSet.has(uri)) {
      newSet.delete(uri);
    } else {
      newSet.add(uri);
    }
    return { images: newSet };
  }),

  // 공개 범위 설정
  setVisibility: (visibility) => set({ visibility }),

  // 일차 설정
  setSelectedDay: (day) => set({ selectedDay: day }),

  // 실제 날짜 설정
  setDate: (date) => set({ date: date }),

  // 폴더 ID 설정
  setFolderId: (id) => set({ folderId: id }),

  // 감정 관련 액션들
  setEmotions: (emotions) => set({ emotions }),
  
  addEmotion: (emotion) => set((state) => {
    if (!state.emotions.includes(emotion)) {
      return { emotions: [...state.emotions, emotion] };
    }
    return state;
  }),
  
  removeEmotion: (emotion) => set((state) => ({
    emotions: state.emotions.filter(e => e !== emotion)
  })),
  
  toggleEmotion: (emotion) => set((state) => {
    if (state.emotions.includes(emotion)) {
      return { emotions: state.emotions.filter(e => e !== emotion) };
    } else {
      return { emotions: [...state.emotions, emotion] };
    }
  }),

  // 상태 초기화
  reset: () => {
    const currentState = get();
    set({
      ...initialState,
      folderId: currentState.folderId, // folderId는 유지
    });
  },
})); 