import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type GoBackProps = {
  marginBottom?: number
  paddingHorizontal?: number
  bgColor?: string
  fallbackRoute?: string
}

export default function GoBack({
  marginBottom = 0,
  paddingHorizontal = 0,
  bgColor = '#E5E7EB',
  fallbackRoute = '/(tabs)',
}: GoBackProps) {
  const router = useRouter()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace(fallbackRoute as any)
    }
  }

  return (
    <View
      style={[
        styles.header,
        { marginBottom, paddingHorizontal },
      ]}
    >
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: bgColor }]}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    // paddingVertical: 10,
  },

  backBtn: {
    width: 35,
    height: 35,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
})