// hooks/useResponsive.ts
import {useWindowDimensions} from 'react-native';

const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const useResponsive = () => {
  const {width, height, scale, fontScale} = useWindowDimensions();

  const isTablet = width >= BREAKPOINTS.md;

  // Cap the width ratio so tablet scaling doesn't go wild
  const widthRatio = Math.min(width / BASE_WIDTH, isTablet ? 1.2 : 2);
  const heightRatio = Math.min(height / BASE_HEIGHT, isTablet ? 1.2 : 2);

  const scaleSize = (size: number) => widthRatio * size;
  const verticalScale = (size: number) => heightRatio * size;
  const moderateScale = (size: number, factor = 0.5) =>
    size + (scaleSize(size) - size) * factor;

  const scaleFont = (size: number) => moderateScale(size) / fontScale;

  return {
    isTablet,
    isMobile: width < BREAKPOINTS.sm,
    breakpoint:
      width >= BREAKPOINTS.xl ? 'xl' :
      width >= BREAKPOINTS.lg ? 'lg' :
      width >= BREAKPOINTS.md ? 'md' :
      width >= BREAKPOINTS.sm ? 'sm' : 'xs',
    scaleSize,
    verticalScale,
    moderateScale,
    scaleFont,
    width,
    height,
    scale,
    fontScale,
  };
};