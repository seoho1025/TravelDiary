import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/Colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.WHITE,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.DARK_GRAY,
  },
});
