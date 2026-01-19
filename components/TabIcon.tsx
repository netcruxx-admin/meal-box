import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
};

export default function TabIcon({ icon, label, focused }: Props) {
  return (
    <View style={[styles.container, focused && styles.activeContainer]}>
      {icon}
      <Text style={[styles.label, focused && styles.activeLabel]}>
        {label}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: '#fff',
      minWidth: 70,
      height: 60,
    },
    activeContainer: {
      backgroundColor: '#E6E6E6',
    },
    label: {
      fontSize: 12,
      marginTop: 4,
      color: '#777',
      textAlign: 'center',
    },
    activeLabel: {
      color: '#000',
      fontWeight: '600',
    },
  });
  