import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { FOLDER_API_URL } from '../constants/api';
import { useDiaryStore } from './DiaryStore';

export interface Folder {
  folderId: number;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  tag: string[];
}

interface FolderListState {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  
  // API 액션들
  fetchFolders: () => Promise<void>;
  createFolder: (folderData: { title: string; startDate: string; endDate: string }) => Promise<void>;
  updateFolder: (id: number, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: number) => Promise<void>;
  fetchFolderDetail: (folderId: string) => Promise<any>;
  
  // 로컬 액션들
  addFolder: (folder: Omit<Folder, 'folderId'>) => void;
  removeFolder: (id: number) => void;
  getLatestFolder: () => Folder | null;
  
  // 상태 초기화
  reset: () => void;
}

const initialState = {
  folders: [],
  isLoading: false,
  error: null,
};

export const useFolderListStore = create<FolderListState>((set, get) => ({
  ...initialState,
  
  // API 액션들
  fetchFolders: async () => {
    console.log('fetchFolders 시작');
    set({ isLoading: true, error: null });
    
    try {
      console.log('서버 API 호출 시도:', `${FOLDER_API_URL}/list`);
      console.log('전체 API URL:', FOLDER_API_URL);
      
      // 타임아웃 설정 (15초로 늘림)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      // /list 엔드포인트 사용
      const { data } = await axios.get(`${FOLDER_API_URL}/list`, {
        signal: controller.signal,
        timeout: 15000
      });
      
      clearTimeout(timeoutId);
      console.log('서버 응답 받음:', data);
      
      // API 응답이 배열 형태로 직접 오는 경우
      if (Array.isArray(data)) {
        console.log('배열 형태 응답, 폴더 설정:', data);
        
        // 서버 응답이 빈 배열이고 로컬에 데이터가 있으면 로컬 데이터 유지
        if (data.length === 0) {
          console.log('서버 응답이 빈 배열, 로컬 데이터 유지');
          set({ 
            isLoading: false, 
            error: null 
          });
        } else {
          // 최신순으로 정렬 (folderId 기준 내림차순)
          const sortedFolders = data.sort((a, b) => b.folderId - a.folderId);
          console.log('정렬된 폴더 목록:', sortedFolders);
          
          set({ 
            folders: sortedFolders, 
            isLoading: false, 
            error: null 
          });
        }
      } else if (data.result_code === 200) {
        // 응답이 result_code를 포함하는 경우
        console.log('result_code 응답, 폴더 설정:', data.data);
        
        // 서버 응답이 빈 배열이고 로컬에 데이터가 있으면 로컬 데이터 유지
        if (!data.data || data.data.length === 0) {
          console.log('서버 응답이 빈 배열, 로컬 데이터 유지');
          set({ 
            isLoading: false, 
            error: null 
          });
        } else {
          // 최신순으로 정렬 (folderId 기준 내림차순)
          const sortedFolders = data.data.sort((a: any, b: any) => b.folderId - a.folderId);
          console.log('정렬된 폴더 목록:', sortedFolders);
          
          set({ 
            folders: sortedFolders || [], 
            isLoading: false, 
            error: null 
          });
        }
      } else {
        throw new Error(data.message || '폴더 목록을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('폴더 조회 에러:', error);
      
      // CanceledError는 타임아웃으로 인한 정상적인 에러
      if (error && typeof error === 'object' && 'name' in error && error.name === 'CanceledError') {
        console.log('서버 타임아웃, 기존 로컬 폴더 목록을 유지합니다.');
      } else {
        console.log('서버 에러 발생, 기존 로컬 폴더 목록을 유지합니다.');
      }
      
      // 서버 에러 발생 시 기존 로컬 데이터 유지 (folders는 변경하지 않음)
      set({ 
        isLoading: false, 
        error: null 
      });
    }
  },
  
  createFolder: async (folderData: { title: string; startDate: string; endDate: string }) => {
    // API 요청 시작 전 상태 초기화
    set({ isLoading: true, error: null });
    
    try {
      console.log('폴더 생성 요청 데이터:', folderData);
      console.log('폴더 생성 API URL:', `${FOLDER_API_URL}`);
      
      // 타임아웃 설정 (10초)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // 폴더 생성 API 요청
      // signal로 요청 취소 가능
      // headers 설정(Content-Type: application/json)
      // 서버 응답값은 data에 들어옴
      const { data } = await axios.post(`${FOLDER_API_URL}`, folderData, {
        signal: controller.signal,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // 요청 성공하면 타임아웃 해제
      clearTimeout(timeoutId);
      console.log('폴더 생성 응답:', data);
      console.log('응답 타입:', typeof data);
      console.log('응답 키들:', Object.keys(data || {}));
      
      // HTTP 201 응답은 성공으로 처리 (응답 Body가 없어도 정상)
      const newFolder: Folder = {
        ...folderData,
        folderId: Date.now(), // 서버에서 ID를 반환하지 않으므로 일시적으로 로컬에서 생성
        image: '', // 기본값 설정
        tag: [], // 기본값 설정
      };
      
      // 새 폴더를 기존 폴더 리스트 맨 앞에 추가
      // 로딩 끝내고, 에러도 초기화
      set((state) => ({
        folders: [newFolder, ...state.folders],
        isLoading: false,
        error: null
      }));
      
      console.log('서버 폴더 생성 완료:', newFolder);
    } catch (error) {
      console.error('폴더 생성 에러 상세:', error);
      
      // AxiosError인 경우 더 자세한 정보 출력
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('서버 응답 상태:', axiosError.response?.status);
        console.error('서버 응답 데이터:', axiosError.response?.data);
        console.error('요청 헤더:', axiosError.config?.headers);
      }
      
      // 서버 에러가 발생하면 로컬에만 저장
      console.log('서버 에러 발생, 로컬에만 저장합니다.');
      
      // 서버 통신 실패해도 앱은 계속 돌아가야 하기 때문에 로컬에만 저장
      const newFolder: Folder = {
        ...folderData,
        folderId: Date.now(),
        image: '', // 기본값 설정
        tag: [], // 기본값 설정
      };
      
      // 에러 무시하고 정상 동작처럼 보여줌
      set((state) => ({
        folders: [newFolder, ...state.folders],
        isLoading: false,
        error: null
      }));
      
      // 에러를 throw하지 않고 성공으로 처리
      console.log('로컬 폴더 생성 완료:', newFolder);
    }
  },
  
  updateFolder: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await axios.put(`${FOLDER_API_URL}/${id}`, updates);
      
      if (data.result_code === 200) {
        set((state) => ({
          folders: state.folders.map(folder => 
            folder.folderId === id ? { ...folder, ...updates } : folder
          ),
          isLoading: false,
          error: null
        }));
      } else {
        throw new Error(data.message || '폴더 수정에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : '폴더 수정에 실패했습니다.';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      throw error;
    }
  },
  
  deleteFolder: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await axios.delete(`${FOLDER_API_URL}/${id}`);
      
      if (data.result_code === 200) {
        set((state) => ({
          folders: state.folders.filter(folder => folder.folderId !== id),
          isLoading: false,
          error: null
        }));
      } else {
        throw new Error(data.message || '폴더 삭제에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message
        : '폴더 삭제에 실패했습니다.';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      throw error;
    }
  },
  
  fetchFolderDetail: async (folderId: string) => {
    try {
      console.log('=== 폴더 상세 조회 시작 ===');
      console.log('폴더 ID:', folderId);
      console.log('API URL:', `${FOLDER_API_URL}/${folderId}`);
      
      // 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await axios.get(`${FOLDER_API_URL}/${folderId}`, {
        signal: controller.signal,
        timeout: 10000
      });
      
      clearTimeout(timeoutId);
      
      console.log('=== 폴더 상세 조회 응답 ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.status === 200) {
        const responseData = response.data;
        
        // API 응답 구조 확인 및 처리
        if (responseData.diaries && Array.isArray(responseData.diaries)) {
          console.log('폴더 상세 조회 성공 (diaries 포함):', responseData);
          
          // 서버에서 받은 일기들을 로컬 스토어에도 저장
          const { addDiary, getDiariesByFolderId } = useDiaryStore.getState();
          const existingDiaries = getDiariesByFolderId(folderId);
          
          responseData.diaries.forEach((diary: any) => {
            // 이미 존재하는 일기인지 확인
            const existingDiary = existingDiaries.find(d => 
              d.date === diary.travelDate && d.title === diary.title
            );
            
            if (!existingDiary) {
              const diaryData = {
                folderId: folderId,
                date: diary.travelDate,
                images: diary.imageUrl ? [diary.imageUrl] : [],
                emotions: [], // 서버에서는 emotions 정보가 없으므로 빈 배열
                visibility: 'public' as const,
                title: diary.title,
                content: diary.content || '',
              };
              
              addDiary(diaryData);
              console.log('서버에서 받은 일기를 로컬에 저장:', diaryData);
            } else {
              console.log('이미 존재하는 일기, 저장하지 않음:', diary.title);
            }
          });
          
          return responseData;
        } else if (responseData.result_code === 200 && responseData.data) {
          console.log('폴더 상세 조회 성공 (result_code):', responseData.data);
          return responseData.data;
        } else {
          console.log('폴더 상세 조회 성공 (직접 데이터):', responseData);
          return responseData;
        }
      } else {
        throw new Error(`폴더 상세 조회 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('=== 폴더 상세 조회 에러 ===');
      console.error('에러 타입:', typeof error);
      console.error('에러 메시지:', error instanceof Error ? error.message : String(error));
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('요청 타임아웃');
          throw new Error('폴더 상세 조회 타임아웃');
        } else if (error.name === 'AxiosError') {
          console.error('Axios 에러:', error);
          const axiosError = error as any;
          if (axiosError.response) {
            console.error('서버 응답 에러:', axiosError.response.status, axiosError.response.data);
            throw new Error(`서버 에러: ${axiosError.response.status} - ${axiosError.response.data?.message || '알 수 없는 에러'}`);
          } else if (axiosError.request) {
            console.error('네트워크 에러:', axiosError.request);
            throw new Error('네트워크 연결 실패');
          }
        }
      }
      
      throw new Error('폴더 상세 조회 중 오류가 발생했습니다.');
    }
  },
  
  // 로컬 액션들
  addFolder: (folderData) => {
    const newFolder: Folder = {
      ...folderData,
      folderId: Date.now(),
    };
    
    set((state) => ({
      folders: [newFolder, ...state.folders], // 최신 폴더가 맨 위에 오도록
    }));
  },
  
  removeFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter(folder => folder.folderId !== id),
    }));
  },
  
  getLatestFolder: () => {
    const state = get();
    return state.folders.length > 0 ? state.folders[0] : null;
  },
  
  // 상태 초기화
  reset: () => set(initialState),
})); 