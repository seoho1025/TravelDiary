import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from './CustomText';

interface BottomTabBarProps {
  activeTab?: string;
  onTabPress?: (tabName: string) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
  activeTab = 'home',
  onTabPress 
}) => {
  const router = useRouter();

  const handleTabPress = (tabName: string) => {
    if (onTabPress) {
      onTabPress(tabName);
    } else {
      // 기본 라우팅
      switch (tabName) {
        case 'home':
          router.push('/(tabs)');
          break;
        case 'mydiary':
          router.push('/(tabs)/mydiary');
          break;
        case 'diary':
          router.push('/(tabs)/diary');
          break;
        case 'feed':
          router.push('/(tabs)/feed');
          break;
        case 'mypage':
          router.push('/(tabs)/mypage');
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 홈 탭 */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('home')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? '#4263EB' : '#8B8B8B'} 
        />
        <CustomText style={[
          styles.tabLabel, 
          activeTab === 'home' && styles.activeTabLabel
        ]}>
          홈
        </CustomText>
      </TouchableOpacity>

      {/* 기록함 탭 */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('mydiary')}
      >
        <MaterialIcons 
          name="event-note" 
          size={24} 
          color={activeTab === 'mydiary' ? '#4263EB' : '#8B8B8B'} 
        />
        <CustomText style={[
          styles.tabLabel, 
          activeTab === 'mydiary' && styles.activeTabLabel
        ]}>
          기록함
        </CustomText>
      </TouchableOpacity>

      {/* 빈 공간 (플로팅 버튼 자리) */}
      <View style={styles.emptySpace} />

      {/* 피드 탭 */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('feed')}
      >
        <FontAwesome 
          name="globe" 
          size={24} 
          color={activeTab === 'feed' ? '#4263EB' : '#8B8B8B'} 
        />
        <CustomText style={[
          styles.tabLabel, 
          activeTab === 'feed' && styles.activeTabLabel
        ]}>
          피드
        </CustomText>
      </TouchableOpacity>

      {/* 마이페이지 탭 */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('mypage')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={activeTab === 'mypage' ? '#4263EB' : '#8B8B8B'} 
        />
        <CustomText style={[
          styles.tabLabel, 
          activeTab === 'mypage' && styles.activeTabLabel
        ]}>
          마이페이지
        </CustomText>
      </TouchableOpacity>

      {/* 중앙 플로팅 버튼 */}
      <TouchableOpacity 
        style={styles.fabContainer}
        onPress={() => handleTabPress('diary')}
      >
        <View style={[
          styles.fabButton, 
          activeTab === 'diary' && styles.fabButtonActive
        ]}>
          <MaterialIcons 
            name="library-add" 
            size={36} 
            color={activeTab === 'diary' ? '#fff' : '#4263EB'} 
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    color: '#8B8B8B',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#4263EB',
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    top: -15,
    left: '50%',
    marginLeft: -35,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  fabButton: {
    backgroundColor: '#fff',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  fabButtonActive: {
    backgroundColor: '#4263EB',
  },
  emptySpace: {
    width: 70, // 플로팅 버튼의 너비와 동일하게 설정
  },
});

export default BottomTabBar; 