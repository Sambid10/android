import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useResponsive } from '../useLayout';

export const MovieCardLoader = () => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const { moderateScale, verticalScale } = useResponsive();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        marginBottom: moderateScale(8),
        borderRadius: moderateScale(8),
        borderWidth: 0.5,
        borderColor: 'gray',
        backgroundColor: 'white',
        opacity: pulseAnim,
        overflow: 'hidden',
      }}
    >
      {/* image placeholder */}
      <View style={{ width: '100%', height: verticalScale(170), backgroundColor: '#DDDDDD' }} />

      {/* content placeholder */}
      <View style={{ padding: moderateScale(8), gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: moderateScale(8) }}>
          {/* icon placeholder */}
          <View style={{ width: moderateScale(20), height: moderateScale(20), borderRadius: 4, backgroundColor: '#DDDDDD', marginTop: 3 }} />
          <View style={{ flex: 1, gap: 6 }}>
            {/* title */}
            <View style={{ height: moderateScale(18), width: '60%', borderRadius: 4, backgroundColor: '#DDDDDD' }} />
            {/* overview line 1 */}
            <View style={{ height: moderateScale(14), width: '100%', borderRadius: 4, backgroundColor: '#DDDDDD' }} />
            {/* overview line 2 */}
            <View style={{ height: moderateScale(14), width: '80%', borderRadius: 4, backgroundColor: '#DDDDDD' }} />
            {/* rating */}
            <View style={{ height: moderateScale(12), width: '20%', borderRadius: 4, backgroundColor: '#DDDDDD' }} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const MovieListLoader = () => (
  <>
    {[...Array(4)].map((_, i) => <MovieCardLoader key={i} />)}
  </>
);