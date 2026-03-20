import { StyleSheet, Text } from 'react-native';

type Props = {
  message?: string;
};

export default function ErrorText({ message }: Props) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },
});
