import AppText from '@/components/AppText';
import { StyleSheet, View } from 'react-native';

export default function PlanScreen() {
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>Plans Screen</AppText>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});
