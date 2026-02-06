import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomBoldText from './CustomBoldText';

interface HeaderProps {
  title?: string;
  showDivider?: boolean;
  dividerStyle?: 'default' | 'none';
  containerStyle?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "TRAVEL DIARY", 
  showDivider = true,
  dividerStyle = 'default',
  containerStyle
}) => {
  const getDividerStyle = () => {
    switch (dividerStyle) {
      case 'none':
        return null;
      default:
        return styles.divider;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <CustomBoldText style={styles.title}>{title}</CustomBoldText>
      {showDivider && dividerStyle !== 'none' && (
        <View style={getDividerStyle()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 56,
    backgroundColor: '#fff',
  },
  title: {
    fontSize:18,
    fontWeight: 'bold',
    color: '#4263EB',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 14,
    marginHorizontal: 16,
  },
});

export default Header; 