import React, { useState, useCallback, useRef, useMemo } from 'react'
import { View, Pressable, Text, Image } from 'react-native'
import { FlashList, FlashListRef, ListRenderItem } from '@shopify/flash-list'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  clamp,
} from 'react-native-reanimated'
import Header from '../../components/Header'
import CategoriesPills from '../../components/CategoriesPills'
import { MovieListLoader } from '../../components/Loaders/MoviesLoader'
import { useResponsive } from '../../components/useLayout'
import { Movie, useGetMovieByGenreQuery, useGetTrendingMovieQuery } from '../../redux/api/movie/movieApi'
import { Popcorn, Star } from 'lucide-react-native'
import { Fonts } from '../../themes/font'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/navigationTypes'

type Nav = NativeStackNavigationProp<RootStackParamList>

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as typeof FlashList


const DestinationCard = React.memo(
  function DestinationCard({ item }: { item: Movie }) {
    const navigation = useNavigation<Nav>()
    const { moderateScale, scaleFont, verticalScale } = useResponsive()

    return (
      <Pressable
        onPress={() => navigation.navigate('VacationDetail', { id: item.id.toString() })}
        style={({ pressed }) => ({
          marginBottom: moderateScale(8),
          backgroundColor: 'white',
          borderRadius: moderateScale(8),
          borderWidth: 0.5,
          flex: 1,
          borderColor: pressed ? '#A82323' : 'gray',
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500/${item.backdrop_path}` }}
          style={{
            width: '100%',
            height: verticalScale(170),
            borderTopRightRadius: moderateScale(8),
            borderTopLeftRadius: moderateScale(8),
          }}
        />
        <View style={{ paddingHorizontal: moderateScale(8), paddingVertical: moderateScale(10) }}>
          <View style={{ flexDirection: 'row', gap: moderateScale(8) }}>
            <Popcorn size={moderateScale(20)} style={{ marginTop: 3 }} color="#A82323" />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: scaleFont(18) }}>
                {item.original_title}
              </Text>
              <Text numberOfLines={2} style={{ fontFamily: Fonts.regular, fontSize: scaleFont(14) }}>
                {item.overview}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={moderateScale(12)} stroke="#F59E0B" fill="#F59E0B" />
                <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(12) }}>
                  {item.vote_average}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    )
  },
  (prev, next) => prev.item.id === next.item.id
)

const MovieFeed = React.memo(function MovieFeed({
  activeCategoryId,
  onSelectCategory,
  cols,
  moderateScale,
}: {
  activeCategoryId: number | null
  onSelectCategory: (id: number | null) => void
  cols: number
  moderateScale: (n: number) => number
}) {
  const { data: trending, isLoading: trendingLoading } = useGetTrendingMovieQuery()
  const { currentData: byGenre, isFetching: genreFetching, isLoading: movieGenreLoading } =
    useGetMovieByGenreQuery(activeCategoryId!, { skip: activeCategoryId === null })

  const isLoading = trendingLoading || genreFetching || movieGenreLoading

  const freshMovies = useMemo(() => (
    activeCategoryId === null ? trending?.results : byGenre?.results
  ), [activeCategoryId, trending, byGenre])

  const prevMoviesRef = useRef(freshMovies)
  if (freshMovies) prevMoviesRef.current = freshMovies
  const movies = freshMovies ?? prevMoviesRef.current

  const listRef = useRef<FlashListRef<Movie>>(null)

  const [headerHeight, setHeaderHeight] = useState(0)
  const headerHeightSV = useSharedValue(0)

  const onHeaderLayout = useCallback((e: any) => {
    const h = e.nativeEvent.layout.height
    if (h > 0) {
      setHeaderHeight(h)
      headerHeightSV.value = h
    }
  }, [])

  const scrollY = useSharedValue(0)
  const prevScrollY = useSharedValue(0)
  const headerOffset = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      const y = event.contentOffset.y
      const delta = y - prevScrollY.value

      headerOffset.value = clamp(
        headerOffset.value - delta,
        -headerHeightSV.value,
        0,
      )

      prevScrollY.value = y
      scrollY.value = y
    },

    onEndDrag(event) {
      const y = event.contentOffset.y
      const h = headerHeightSV.value
      if (y < h) { headerOffset.value = withTiming(0); return }
      headerOffset.value = withTiming(headerOffset.value < -h / 2 ? -h : 0)
    },

    onMomentumEnd(event) {
      const y = event.contentOffset.y
      const h = headerHeightSV.value
      if (y < h) { headerOffset.value = withTiming(0); return }
      headerOffset.value = withTiming(headerOffset.value < -h / 2 ? -h : 0)
    },
  })

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerOffset.value }],
  }))

  const renderItem: ListRenderItem<Movie> = useCallback(({ item }) => (
    <DestinationCard item={item} />
  ), [])

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        onLayout={onHeaderLayout}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: '#F3F2EC',
          },
          headerAnimatedStyle,
        ]}
      >
        <Header />
        <CategoriesPills
          activeId={activeCategoryId}
          onCategoryChange={onSelectCategory}
        />
      </Animated.View>

      {/* list */}
      {isLoading && !prevMoviesRef.current ? (
        <MovieListLoader />
      ) : (
        <AnimatedFlashList
          removeClippedSubviews
          ref={listRef as any}
          numColumns={cols}
          key={activeCategoryId ?? 'trending'}
          data={movies}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          keyExtractor={(item) => (item as Movie).id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: moderateScale(12),
          }}
        />
      )}

    </View>
  )
})

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const { moderateScale, isTablet } = useResponsive()
  const cols = isTablet ? 3 : 1

  const handleCategorySelect = useCallback((id: number | null) => {
    requestAnimationFrame(() => setActiveCategoryId(id))
  }, [])

  return (
    <View style={{ flex: 1, paddingHorizontal: moderateScale(12) }}>
      <MovieFeed
        activeCategoryId={activeCategoryId}
        onSelectCategory={handleCategorySelect}
        cols={cols}
        moderateScale={moderateScale}
      />
    </View>
  )
}