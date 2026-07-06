import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Animated from 'react-native-reanimated'

type Props = {
  onLayout: (height: number) => void
  animatedStyle: any
}
import { useSafeAreaInsets } from 'react-native-safe-area-context'
export default function PracticeHeader({
  onLayout,
  animatedStyle,
}: Props) {
  return (
    <Animated.View
      onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
      style={[styles.header, animatedStyle]}
    >
      <Text style={styles.title}>YouTube Header</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 10,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
})