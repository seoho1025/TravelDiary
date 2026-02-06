import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { API_URL } from '../constants/api';
import { DiaryCreateParams } from '../types/diary';

interface DiaryCreateResponse {
  result_code: number;
  message: string;
  data: {
    diary_id: string;
  };
}

interface DiaryCreateState {
  isLoading: boolean;
  error: string | null;
  diaryId: string | null;
  date: string | null;
  createDiary: (params: DiaryCreateParams & { visibility?: string }, onSuccess?: () => void) => Promise<void>;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  error: null,
  diaryId: null,
  date: null,
};

export const useDiaryCreateStore = create<DiaryCreateState>((set) => ({
  ...initialState,

  createDiary: async (params: DiaryCreateParams & { visibility?: string }, onSuccess?: () => void) => {
    set({ isLoading: true, error: null });

    try {
      // 변환 없이 바로 사용
      const payload: any = {
        date: params.date, // 변환 없이 그대로 사용
        location: params.location,
        emotions: params.emotions,
        weather: params.weather,
        companion: params.companion,
        image: (params as any).image_base64,
      };
      if (params.visibility) payload.visibility = params.visibility;

      const { data } = await axios.post<DiaryCreateResponse>(API_URL, payload, {

      });

      if (data.result_code !== 200) {
        throw new Error(data.message);
      }

      set({ 
        isLoading: false, 
        diaryId: data.data.diary_id,
        error: null 
      });

      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : '일기 생성 중 오류가 발생했습니다.';
      set({ 
        isLoading: false, 
        error: errorMessage,
        diaryId: null 
      });
      throw error;
    }
  },

  reset: () => set(initialState),
})); 