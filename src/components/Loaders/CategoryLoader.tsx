import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const CategoryLoader = () => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
        marginBottom: 12,
        height: 35,
      }}
    >
      {[...Array(8)].map((_, index) => (
        <Animated.View
          key={index}
          style={{
            width: [70, 90, 110, 80, 100, 75, 95, 85][index],
            borderRadius: 8,
            backgroundColor: "#DDDDDD",
            opacity: pulseAnim,
          }}
        />
      ))}
    </View>
  );
};