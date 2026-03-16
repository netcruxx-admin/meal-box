import { colors } from '@/constants/theme'
import { Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export default function _layout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationTypeForReplace: 'push',
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </View>
  )
}
