import { colors, fonts } from '@/constants/theme'
import Entypo from '@expo/vector-icons/Entypo'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type GoBackProps = {
  marginBottom?: number
  paddingHorizontal?: number
}

export default function GoBack({
  marginBottom,
  paddingHorizontal,
}: GoBackProps) {
  const router = useRouter()

  return (
    <View
      style={[
        styles.header,
        { marginBottom: marginBottom, paddingHorizontal: paddingHorizontal },
      ]}
    >
      <TouchableOpacity style={styles.touchable} onPress={() => router.back()}>
        <Entypo name='chevron-left' size={24} color={colors.text} />
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
  },
  touchable: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.md,
    color: colors.text,
  },
})