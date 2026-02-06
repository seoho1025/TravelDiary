import { DiaryCreateParams } from '@/types/diary';
import { create } from 'zustand';

// 일기 작성 폼의 상태 타입 정의
interface DiaryFormState {
  // 입력 필드들
  date: string;
  location: string;
  emotions: string[];
  weather: string;
  companion: string;
  image_base64: string;

  // 액션들
  setDate: (date: string) => void;
  setLocation: (location: string) => void;
  setEmotions: (emotions: string[]) => void;
  setWeather: (weather: string) => void;
  setCompanion: (companion: string) => void;
  setImageBase64: (image_base64: string) => void;
  
  // 동적 필드 설정
  setField: <K extends keyof DiaryFormState>(
    field: K,
    value: DiaryFormState[K]
  ) => void;

  // 상태 초기화
  reset: () => void;

  // API 요청용 파라미터 변환
  toCreateParams: () => DiaryCreateParams;
}

// 초기 상태
const initialState = {
  date: new Date().toISOString(),
  location: '',
  emotions: [],
  weather: '',
  companion: '',
  image_base64: '',
};

// 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
function formatDateToISO(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Store 생성
export const useDiaryFormStore = create<DiaryFormState>((set, get) => ({
  ...initialState,

  // 개별 필드 setter
  setDate: (date) => set({ date }),
  setLocation: (location) => set({ location }),
  setEmotions: (emotions) => set({ emotions }),
  setWeather: (weather) => set({ weather }),
  setCompanion: (companion) => set({ companion }),
  setImageBase64: (image_base64) => set({ image_base64 }),

  // 동적 필드 설정
  setField: (field, value) => set({ [field]: value }),

  // 상태 초기화
  reset: () => set(initialState),

  // API 요청용 파라미터 변환
  toCreateParams: () => {
    const state = get();
    return {
      date: formatDateToISO(state.date),
      location: state.location,
      emotions: state.emotions,
      weather: state.weather,
      companion: state.companion,
      image_base64: state.image_base64,
    };
  },
  
})); 