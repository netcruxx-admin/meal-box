import { fonts } from '@/constants/theme'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import AppText from './AppText'

type ButtonProps = {
  onPress?: () => void
  title: string
  variant?: 'fill' | 'outline'
  disabled?: boolean
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
}

export default function Button({
  onPress,
  title,
  variant = 'fill',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: variant === 'fill' ? '#111' : 'transparent',
          borderColor: '#111',
          borderWidth: 1,
          width: fullWidth ? '100%' : 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 10,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <AppText
        style={{
          color: variant === 'fill' ? '#fff' : '#111',
          fontSize: fonts.size.md,
        }}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  )
}