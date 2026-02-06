# TRAVELDIARY

여행의 추억을 기록하고, 나만의 여행 일기를 관리할 수 있는 모바일 애플리케이션입니다.

## 주요 기능

- **여행 일기 생성**: 날짜, 동행자, 감정, 장소, 사진, 해시태그 등 다양한 정보를 입력하여 여행 일기를 작성할 수 있습니다.
- **일기 목록/상세 조회**: 내가 쓴 일기를 한눈에 보고, 상세 내용을 확인할 수 있습니다.
- **일기 공유 기능**: 다양한 탭을 통해 다른 사람의 일기를 볼 수 있습니다.

## 기술 스택

- React Native (Expo)
- TypeScript
- Zustand (상태 관리)
- Expo Router (라우팅)
- React Navigation
- 기타: axios, react-native-calendars 등

## 폴더 구조

```
app/
  (tabs)/                # 하단 탭 네비게이션 그룹
    index.tsx            # 홈
    mydiary.tsx          # 기록함(내 일기)
    feed.tsx             # 피드
    mypage.tsx           # 마이페이지
    diary.tsx            # 일기 생성(캘린더)
  creating_diary/        # 일기 생성 플로우
    Calendar.tsx         # 날짜 선택(캘린더)
    select-country.tsx   # 나라 선택
    select-city.tsx      # 도시 선택
    companion.tsx        # 동행자 선택
    emotion.tsx          # 감정 선택
    photo.tsx            # 사진 선택/업로드
    select-hashtag.tsx   # 해시태그 선택
    diary.tsx            # 일기 상세/작성
    complete.tsx         # 작성 완료
components/              # 재사용 컴포넌트
constants/               # 상수 (colors, api 등)
store/                   # Zustand 스토어
types/                   # 타입 정의
assets/                  # 이미지, 폰트 등 정적 리소스
```

## 설치 및 실행

```bash
npm install
npm start
```

## 상태 관리

- `useDiaryFormStore`: 일기 작성 중 입력값 관리
- `useDiaryStore`: 일기 목록/상세 데이터 관리

## 기타

- 협업: GitHub Flow(브랜치 분리 + PR)
- 스타일: constants/colors.ts 등에서 일관성 있게 관리
