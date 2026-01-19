import { fonts } from '@/constants/theme'
import { StyleSheet, Text, TextProps } from 'react-native'

export type AppTextProps = TextProps & {
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold'
  type?: 'default' | 'title' | 'subTitle'
  align?: 'left' | 'center' | 'right'
}

// TODO: Bold font is not working
export default function AppText({
  style,
  weight = 'regular',
  type = 'default',
  align = 'left',
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[
        style,
        { textAlign: align },
        weight === 'regular' ? styles.poppinsRegular : undefined,
        weight === 'medium' ? styles.poppinsMedium : undefined,
        weight === 'semiBold' ? styles.poppinsSemiBold : undefined,
        weight === 'bold' ? styles.poppinsBold : undefined,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subTitle' ? styles.subTitle : undefined,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  poppinsRegular: {
    fontFamily: 'Poppins_400Regular',
    fontWeight: '400',
  },
  poppinsMedium: {
    fontFamily: 'Poppins_500Medium',
    fontWeight: '500',
  },
  poppinsSemiBold: {
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
  },
  poppinsBold: {
    fontFamily: 'Poppins_700Bold',
    fontWeight: '700',
  },
  default: {
    fontSize: fonts.size.md,
    lineHeight: fonts.lineHeight.md,
    // color: colors.text,
  },
  title: {
    fontSize: fonts.size['2xl'],
    lineHeight: fonts.lineHeight['2xl'],
    // color: colors.text,
  },
  subTitle: {
    fontSize: fonts.size.lg,
    lineHeight: fonts.lineHeight.lg,
    // color: colors.text,
  },
})
