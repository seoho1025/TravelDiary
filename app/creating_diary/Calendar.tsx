import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomText from "../../components/CustomText";
import { useDiaryFormStore } from '../../store/useDiaryFormStore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HEADER_HEIGHT = 56 + 16 + 32 + 18 + 54;
const TABBAR_HEIGHT = 80;
const CALENDAR_HEIGHT = windowHeight - HEADER_HEIGHT - TABBAR_HEIGHT;
const CELL_WIDTH = windowWidth / 7;
const CELL_HEIGHT = CALENDAR_HEIGHT / 6;

// 캘린더 컴포넌트(단일 날짜 선택만 가능함)

const getMonthLabel = (date: Date) => {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const CalendarScreen: React.FC = () => {
  const [date, setDate] = useState<string | null>(null);
  const [current, setCurrent] = useState(new Date());
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const setDateStore = useDiaryFormStore(state => state.setDate);
  const router = useRouter();

  const reset = () => {
    setDate(null);
    setIsConfirmed(false);
    setModalVisible(false);
  };

  const onDayPress = (day: { dateString: string }) => {
    const dateString = day.dateString;
    // 단일 날짜만 선택 가능: 이미 선택되어 있으면 새로 선택
    setDate(dateString);
    setIsConfirmed(true);
    setModalVisible(true);
  };

  const getMarkedDates = (): { [key: string]: any } => {
    if (!date) return {};
    if (isConfirmed && date) {
      return {
        [date]: {
          startingDay: true,
          endingDay: true,
          color: '#4263EB',
          textColor: '#fff',
        },
      };
    }
    // 임시 선택(확정 전)
    return {
      [date]: {
        color: '#E6EDFF',
        textColor: '#222',
      },
    };
  };

  const markedDates = getMarkedDates();

  // Calendar.tsx와 동일한 커스텀 헤더
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
      <CustomText style={styles.monthLabel}>{getMonthLabel(current)}</CustomText>
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
    if (date) {
      setDateStore(date);
      reset();
      router.push('/creating_diary/select-country');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>TRAVEL DIARY</Text>
        <View style={styles.divider} />
        <Calendar
          style={{
            width: windowWidth,
            height: CALENDAR_HEIGHT,
            alignSelf: 'center',
            paddingVertical: 0,
            margin: 0,
          }}
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
          theme={{
            backgroundColor: '#fff',
            calendarBackground: '#fff',
            textSectionTitleColor: '#B0B8C1',
            selectedDayBackgroundColor: '#4263EB',
            selectedDayTextColor: '#fff',
            todayTextColor: '#4263EB',
            dayTextColor: '#222',
            textDisabledColor: '#D3D3D3',
            arrowColor: '#4263EB',
            monthTextColor: '#222',
            textMonthFontWeight: '700',
            textMonthFontSize: 24,
            textDayFontWeight: '400',
            textDayFontSize: 18,
            textDayHeaderFontWeight: '400',
            textDayHeaderFontSize: 15,
          }}
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
              <View style={{ width: CELL_WIDTH, height: CELL_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={state === 'disabled'}
                  onPress={() => onDayPress(date)}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT,
                    backgroundColor: 'transparent',
                    position: 'relative',
                    paddingTop: 4,
                  }}
                >
                  {bgColor !== 'transparent' && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: CELL_HEIGHT / 2,
                        backgroundColor: bgColor,
                        borderTopLeftRadius:
                          isSingle || isRangeStart ? CELL_WIDTH / 2 : 0,
                        borderTopRightRadius:
                          isSingle || isRangeEnd ? CELL_WIDTH / 2 : 0,
                        borderBottomLeftRadius:
                          isSingle || isRangeStart ? CELL_WIDTH / 2 : 0,
                        borderBottomRightRadius:
                          isSingle || isRangeEnd ? CELL_WIDTH / 2 : 0,
                      }}
                    />
                  )}
                  <CustomText
                    style={{
                      fontSize: 18,
                      fontWeight: '400',
                      color: textColor,
                      lineHeight: 24,
                      zIndex: 1,
                    }}
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
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{
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
          }}>
            <CustomText style={{
              marginBottom: 24,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#444',
              textAlign: 'center'
            }}>
              여행의 추억을 기록해 볼까요?
            </CustomText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* 취소 버튼 */}
              <TouchableOpacity
                onPress={reset}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: '#3366FF',
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: 'white'
                }}
              >
                <CustomText style={{ color: '#3366FF', fontSize: 18, fontWeight: 'bold' }}>취소</CustomText>
              </TouchableOpacity>
              {/* 생성하기 버튼 */}
              <TouchableOpacity
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  backgroundColor: '#3366FF',
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: 'center'
                }}
              >
                <CustomText style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>생성하기</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 56,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4263EB',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 18,
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  monthLabel: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 24,
    textAlign: 'center',
  },
}); 