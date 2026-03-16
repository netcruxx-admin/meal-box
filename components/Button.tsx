import { colors, fonts } from '@/constants/theme'
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'

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
          backgroundColor: variant === 'fill' ? colors.primary : 'transparent',
          borderColor: colors.primary,
          borderWidth: 2,
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
      <Text
        style={{
          color: variant === 'fill' ? '#ffffff' : colors.primary,
          fontSize: fonts.size.md,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}