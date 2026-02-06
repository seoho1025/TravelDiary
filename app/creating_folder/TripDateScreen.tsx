import CustomMediumText from '@/components/CustomMediumText';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomText from "../../components/CustomText";
import Header from "../../components/Header";
import { colors } from '../../constants/Colors';
import { useFolderFormStore } from '../../store/FolderFormStore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HEADER_HEIGHT = 56 + 16 + 32 + 18 + 54;
const TABBAR_HEIGHT = 80;
const CALENDAR_HEIGHT = windowHeight - HEADER_HEIGHT - TABBAR_HEIGHT;
const CELL_WIDTH = windowWidth / 7;
const CELL_HEIGHT = CALENDAR_HEIGHT / 6;

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

// 월 라벨 포맷팅 함수(예시: 2025.01)
const getMonthLabel = (date: Date) => {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// TripDateScreen 컴포넌트가 받을 props 타입을 정의
interface TripDateScreenProps {
  onConfirm?: (date: string | { start: string; end?: string }) => void;
}

// 함수형 컴포넌트 선언 부분
const TripDateScreen: React.FC<TripDateScreenProps> = ({ onConfirm }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [current, setCurrent] = useState(new Date());
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const setStartDateStore = useFolderFormStore(state => state.setStartDate);
  const setEndDateStore = useFolderFormStore(state => state.setEndDate);
  const resetDatesStore = useFolderFormStore(state => state.resetDates);

  const calendarTheme = {
    backgroundColor: colors.WHITE,
    calendarBackground: colors.WHITE,
    textSectionTitleColor: colors.DARK_GRAY,
    selectedDayBackgroundColor: colors.BLUE,
    selectedDayTextColor: colors.WHITE,
    todayTextColor: colors.BLUE,
    dayTextColor: '#222',
    textDisabledColor: '#D3D3D3',
    arrowColor: '#4263EB',
    monthTextColor: '#222',
    textMonthFontWeight: '700' as const,
    textMonthFontSize: 24,
    textDayFontWeight: '400' as const,
    textDayFontSize: 18,
    textDayHeaderFontWeight: '400' as const,
    textDayHeaderFontSize: 15,
  };

  const reset = () => {
    setStartDate(null);
    setEndDate(null);
    setIsConfirmed(false);
    setModalVisible(false);
  };

  const onDayPress = (day: DateObject) => {
    const dateString = day.dateString;

    // 시작일이 없거나 시작일과 종료일이 모두 있는 경우
    if (!startDate || (startDate && endDate)) {
      //현재 선택한 날짜 시작일로 지정, 새로 시작
      setStartDate(dateString);
      setEndDate(null);
      setIsConfirmed(false);
    } else if (startDate && !endDate) {
      if (new Date(dateString) < new Date(startDate)) {
        setStartDate(dateString);
        setIsConfirmed(false);
      } else if (dateString === startDate) {
        // 단일 선택 확정
        setIsConfirmed(true);
        setModalVisible(true);
      } else {
        setEndDate(dateString);
        setIsConfirmed(true);
        setModalVisible(true);
      }
    }
  };

  const getMarkedDates = (): { [key: string]: any } => {
    if (!startDate) return {};

    // 임시 선택(확정 전)
    if (!isConfirmed) {
      return {
        [startDate]: {
          color: '#E6EDFF',
          textColor: '#222',
        },
      };
    }

    // 단일 선택 확정 (endDate 없음)
    if (isConfirmed && startDate && !endDate) {
      return {
        [startDate]: {
          startingDay: true,
          endingDay: true,
          color: '#4263EB',
          textColor: colors.WHITE,
        },
      };
    }

    // 확정(범위)
    const marked: { [key: string]: any } = {
      [startDate]: {
        startingDay: true,
        color: '#4263EB',
        textColor: colors.WHITE,
      },
    };

    if (endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        if (dateStr !== startDate && dateStr !== endDate) {
          marked[dateStr] = {
            color: '#E6EDFF',
            textColor: '#222',
          };
        }
        current.setDate(current.getDate() + 1);
      }

      marked[endDate] = {
        endingDay: true,
        color: '#4263EB',
        textColor: '#fff',
      };
    }

    return marked;
  };

  const markedDates = getMarkedDates();

  // 커스텀 헤더
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <TouchableOpacity
        onPress={() => {
          const prev = new Date(current);
          prev.setMonth(prev.getMonth() - 1);
          setCurrent(prev);
        }}
      >
        <Ionicons name="chevron-back" size={32} color="#D1D5DB" />
      </TouchableOpacity>
      <CustomMediumText style={styles.monthLabel}>{getMonthLabel(current)}</CustomMediumText>
      <TouchableOpacity
        onPress={() => {
          const next = new Date(current);
          next.setMonth(next.getMonth() + 1);
          setCurrent(next);
        }}
      >
        <Ionicons name="chevron-forward" size={32} color="#D1D5DB" />
      </TouchableOpacity>
    </View>
  );

  const handleConfirm = () => {
    setModalVisible(false);
    setIsConfirmed(false);
    if (onConfirm) {
      if (startDate && endDate) {
        onConfirm({ start: startDate, end: endDate });
      } else if (startDate) {
        onConfirm(startDate);
      }
    }
    setStartDateStore(startDate);
    setEndDateStore(endDate);
    reset();
    router.push('/creating_folder/FolderTitleScreen');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Header />
        <Calendar
          style={styles.calendar}
          key={current.toISOString()}
          current={current.toISOString().split('T')[0]}
          onDayPress={onDayPress}
          markingType={'period'}
          markedDates={markedDates}
          hideExtraDays={false}
          renderHeader={renderHeader}
          hideArrows={true}
          onVisibleMonthsChange={months => {
            if (months && months[0]) {
              setCurrent(new Date(months[0].dateString));
            }
          }}
          theme={calendarTheme}
          dayComponent={({ date, state }) => {
            if (!date) return <View />;
            const isSunday = new Date(date.dateString).getDay() === 0;
            const mark = markedDates[date.dateString];

            let bgColor = 'transparent';
            let textColor = state === 'disabled' ? '#D3D3D3' : '#222';

            if (mark) {
              if (mark.startingDay && mark.endingDay) {
                bgColor = '#4263EB';
                textColor = '#fff';
              } else if (mark.startingDay) {
                bgColor = '#4263EB';
                textColor = '#fff';
              } else if (mark.endingDay) {
                bgColor = '#4263EB';
                textColor = '#fff';
              } else if (mark.color === '#E6EDFF') {
                bgColor = '#E6EDFF';
                textColor = '#222';
              }
            }
            if (isSunday && textColor === '#222') textColor = '#F04438';

            // 단일 선택(시작=끝)일 때만 완전한 원형
            const isSingle = mark?.startingDay && mark?.endingDay;
            const isRangeStart = mark?.startingDay && !mark?.endingDay;
            const isRangeEnd = mark?.endingDay && !mark?.startingDay;

            return (
              <View style={styles.calendarCell}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={state === 'disabled'}
                  onPress={() => onDayPress(date)}
                  style={styles.calendarDayTouchable}
                >
                  {bgColor !== 'transparent' && (
                    <View
                      style={[
                        styles.calendarDayBackground,
                        {
                          backgroundColor: bgColor,
                          borderTopLeftRadius:
                            isSingle || isRangeStart ? CELL_WIDTH / 2 : 0,
                          borderTopRightRadius:
                            isSingle || isRangeEnd ? CELL_WIDTH / 2 : 0,
                          borderBottomLeftRadius:
                            isSingle || isRangeStart ? CELL_WIDTH / 2 : 0,
                          borderBottomRightRadius:
                            isSingle || isRangeEnd ? CELL_WIDTH / 2 : 0,
                        }
                      ]}
                    />
                  )}
                  <CustomText
                    style={[
                      styles.calendarDayText,
                      { color: textColor }
                    ]}
                  >
                    {date.day}
                  </CustomText>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            setIsConfirmed(false);
            // 선택된 날짜들 리셋
            setStartDate(null);
            setEndDate(null);
            resetDatesStore();
          }}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
          >
            <CustomMediumText style={styles.modalTitle}>
              새 여행 다이어리를 만들까요?
            </CustomMediumText>
            <View style={styles.modalButtonContainer}>
              {/* 시작하기 버튼 */}
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                <CustomMediumText style={styles.confirmButtonText}>시작하기</CustomMediumText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default TripDateScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  monthLabel: {
    fontSize: 32,
    color: colors.BLACK,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  calendar: {
    width: windowWidth,
    height: CALENDAR_HEIGHT,
    alignSelf: 'center',
    paddingVertical: 0,
    margin: 0,
  },
  calendarCell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayTouchable: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    backgroundColor: 'transparent',
    position: 'relative',
    paddingTop: 10,
  },
  calendarDayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CELL_HEIGHT / 2,
  },
  calendarDayText: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 24,
    width: 320,
    maxWidth: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    marginBottom: 24,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 0.7,
    backgroundColor: '#3366FF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.WHITE,
    fontSize: 18,
  },
});
