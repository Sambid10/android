import React, { useState, useCallback } from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ArrowLeft, Search, Star, Popcorn, X } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native'
import { Fonts } from '../../themes/font'
import { getFontSize } from '../../themes/scaleFont'
import { useResponsive } from '../../components/useLayout'
import useDebounce from '../../hooks/useDebounce'
import { useGetSearchedMovieQuery, Movie } from '../../redux/api/movie/movieApi'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/navigationTypes'
import { SimpleLoader } from '../../components/Loaders/SimpleLoader'
type Nav = NativeStackNavigationProp<RootStackParamList>

const HeroCard = React.memo(function HeroCard({ item }: { item: Movie }) {
  const navigation = useNavigation<Nav>()
  const { moderateScale, scaleFont, verticalScale } = useResponsive()
  const year = item.release_date?.split('-')[0]

  return (
    <Pressable
      onPress={() => navigation.navigate('VacationDetail', { id: item.id.toString() })}
      style={({ pressed }) => [styles.heroCard, { opacity: pressed ? 0.9 : 1, borderRadius: moderateScale(12) }]}
    >
      {item.backdrop_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}` }}
          style={{ width: '100%', height: verticalScale(150), borderTopLeftRadius: moderateScale(12), borderTopRightRadius: moderateScale(12) }}
        />
      ) : (
        <View style={[styles.imageFallback, { height: verticalScale(150), borderTopLeftRadius: moderateScale(12), borderTopRightRadius: moderateScale(12) }]} />
      )}
      <View style={styles.ratingBadge}>
        <Star size={10} stroke="#F59E0B" fill="#F59E0B" />
        <Text style={styles.ratingBadgeText}>{item.vote_average?.toFixed(1)}</Text>
      </View>
      <View style={{ padding: moderateScale(10) }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: moderateScale(8) }}>
          <Popcorn size={moderateScale(18)} color="#A82323" style={{ marginTop: 2 }} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.title, { fontSize: scaleFont(16) }]}>{item.original_title}</Text>
            <Text numberOfLines={2} style={[styles.overview, { fontSize: scaleFont(13) }]}>{item.overview}</Text>
            {year ? <Text style={[styles.year, { fontSize: scaleFont(12) }]}>{year}</Text> : null}
          </View>
        </View>
      </View>
    </Pressable>
  )
})

const CompactCard = React.memo(function CompactCard({ item }: { item: Movie }) {
  const navigation = useNavigation<Nav>()
  const { moderateScale, scaleFont } = useResponsive()
  const year = item.release_date?.split('-')[0]

  return (
    <Pressable
      onPress={() => navigation.navigate('VacationDetail', { id: item.id.toString() })}
      style={({ pressed }) => [styles.compactCard, { opacity: pressed ? 0.9 : 1, borderRadius: moderateScale(8) }]}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
          style={{ width: 90, borderTopLeftRadius: moderateScale(8), borderBottomLeftRadius: moderateScale(8) }}
        />
      ) : (
        <View style={[styles.imageFallback, { width: 90, borderTopLeftRadius: moderateScale(12), borderBottomLeftRadius: moderateScale(12) }]} />
      )}
      <View style={{ flex: 1, padding: moderateScale(14), gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Popcorn size={moderateScale(14)} color="#A82323" />
          <Text style={[styles.title, { fontSize: scaleFont(14), flex: 1 }]} numberOfLines={1}>
            {item.original_title}
          </Text>
        </View>
        <Text numberOfLines={2} style={[styles.overview, { fontSize: scaleFont(12) }]}>
          {item.overview}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Star size={moderateScale(12)} stroke="#F59E0B" fill="#F59E0B" />
          <Text style={[styles.year, { fontSize: scaleFont(12) }]}>
            {item.vote_average?.toFixed(1)}{year ? ` · ${year}` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  )
})

const SearchCard = React.memo(function SearchCard({ item, index }: { item: Movie; index: number }) {
  if (index === 0) return <HeroCard item={item} />
  return <CompactCard item={item} />
})

export default function SearchScreen() {
  const navigation = useNavigation()
  const { scaleSize, scaleFont } = useResponsive()
  const [searchVal, setSearchVal] = useState('')
  const debouncedVal = useDebounce({ delay: 400, value: searchVal })

  const { data, isLoading, isFetching } = useGetSearchedMovieQuery(debouncedVal, {
    skip: debouncedVal.trim().length === 0,
  })

  const renderItem = useCallback(({ item, index }: { item: Movie; index: number }) => (
    <SearchCard item={item} index={index} />
  ), [])

  const showLoader = (isLoading || isFetching) && debouncedVal.trim().length > 0

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F2EC', paddingHorizontal: scaleSize(12),paddingTop:scaleSize(6) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(8), marginBottom: scaleSize(12) }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingRight: scaleSize(4) })}
        >
          <ArrowLeft size={scaleFont(28)} />
        </Pressable>
        <View style={[styles.searchBar, { borderRadius: scaleSize(8), paddingHorizontal: scaleSize(10), gap: scaleSize(8) }]}>
          <Search size={scaleFont(16)} color="gray" />
          <TextInput
            autoFocus
            value={searchVal}
            onChangeText={setSearchVal}
            placeholderTextColor="gray"
            placeholder="Search movies..."
            style={{
              flex: 1,
              color: '#000',
              fontFamily: Fonts.regular,
              fontSize: getFontSize(14),
              paddingVertical: scaleSize(12),
            }}
          />
          {searchVal.length > 0 && (
            <Pressable onPress={() => setSearchVal('')} hitSlop={8}>
              <X size={scaleFont(14)} color="gray" />
            </Pressable>
          )}
        </View>
      </View>

      {showLoader ? (
        <SimpleLoader />
      ) : (
        <FlatList
          data={data?.results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: scaleSize(16) }}
          ListHeaderComponent={
            data?.total_results ? (
              <Text style={[styles.resultCount, { fontSize: scaleFont(12) }]}>
                {data.total_results} movies found.
              </Text>
            ) : null
          }
          ListEmptyComponent={
            debouncedVal.trim().length > 0 && !isLoading && !isFetching ? (
              <View style={styles.emptyState}>
                <Popcorn size={40} color="#ccc" />
                <Text style={[styles.emptyTitle, { fontSize: scaleFont(15) }]}>
                  No results for "{debouncedVal}"
                </Text>
                <Text style={[styles.emptySubtitle, { fontSize: scaleFont(13) }]}>
                  Try a different title or keyword
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderWidth: 0.5, borderColor: 'gray',
  },
  heroCard: {
    backgroundColor: 'white', borderWidth: 0.5,
    borderColor: 'gray', overflow: 'hidden',
  
  },
  compactCard: {
    backgroundColor: 'white', borderWidth: 0.5,
    borderColor: 'gray', flexDirection: 'row',
    overflow: 'hidden', minHeight: 100,
    elevation:1,
  },
  imageFallback: {
    backgroundColor: '#1a1a2e',
  },
  ratingBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  ratingBadgeText: { color: 'white', fontSize: 11, fontFamily: Fonts.regular },
  title: { fontFamily: Fonts.semiBold, color: '#000' },
  overview: { fontFamily: Fonts.regular, color: '#121212', lineHeight: 12 },
  year: { fontFamily: Fonts.regular, color: '#121212' },
  resultCount: { fontFamily: Fonts.regular, color: '#121212', marginBottom: 4, paddingLeft: 2 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontFamily: Fonts.semiBold, color: '#000', marginTop: 8 },
  emptySubtitle: { fontFamily: Fonts.medium, color: 'gray' },
})