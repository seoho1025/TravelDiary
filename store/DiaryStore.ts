import { create } from 'zustand';

export interface Diary {
  id: string;
  folderId: string;
  date: string;
  title?: string;
  content?: string;
  images: string[];
  emotions: string[];
  visibility: 'public' | 'private';
  createdAt: string;
}

interface DiaryState {
  diaries: Diary[];
  addDiary: (diary: Omit<Diary, 'id' | 'createdAt'>) => void;
  removeDiary: (id: string) => void;
  updateDiary: (id: string, updates: Partial<Diary>) => void;
  getDiariesByFolderId: (folderId: string) => Diary[];
  getDiaryById: (id: string) => Diary | null;
  getLatestDiary: () => Diary | null;
  fetchDiaryById: (id: string) => Promise<Diary | null>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  diaries: [],
  
  addDiary: (diaryData) => {
    const newDiary: Diary = {
      ...diaryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      diaries: [newDiary, ...state.diaries], // 최신 일기가 맨 위에 오도록
    }));
  },
  
  removeDiary: (id) => {
    set((state) => ({
      diaries: state.diaries.filter(diary => diary.id !== id),
    }));
  },
  
  updateDiary: (id, updates) => {
    set((state) => ({
      diaries: state.diaries.map(diary => 
        diary.id === id ? { ...diary, ...updates } : diary
      ),
    }));
  },
  
  getDiariesByFolderId: (folderId) => {
    const state = get();
    return state.diaries.filter(diary => diary.folderId === folderId);
  },
  
  getDiaryById: (id) => {
    const state = get();
    return state.diaries.find(diary => diary.id === id) || null;
  },
  
  getLatestDiary: () => {
    const state = get();
    return state.diaries.length > 0 ? state.diaries[0] : null;
  },
  
  fetchDiaryById: async (id: string) => {
    try {
      const response = await fetch(`https://travel-journal-ai.onrender.com/api/diary/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch diary');
      }
      
      const data = await response.json();
      
      // API 응답을 Diary 인터페이스에 맞게 변환
      const diary: Diary = {
        id: data.diaryId.toString(),
        folderId: '', // API에서 제공하지 않으므로 빈 문자열
        date: data.travelDate,
        title: data.title,
        content: data.content,
        images: data.imageUrl ? [data.imageUrl] : [],
        emotions: data.emotions?.map((emotion: any) => emotion.emotion.name) || [],
        visibility: data.visibility.toLowerCase() as 'public' | 'private',
        createdAt: data.createdAt,
      };
      
      return diary;
    } catch (error) {
      console.error('일기 상세 조회 에러:', error);
      return null;
    }
  },
})); 