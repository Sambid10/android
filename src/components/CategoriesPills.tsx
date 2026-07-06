import React, { useCallback } from 'react'
import { StyleSheet, ScrollView, Pressable, Text, View } from 'react-native'
import { useGetMovieCategoriesQuery } from '../redux/api/movie/movieApi'
import { CategoryLoader } from './Loaders/CategoryLoader'
import { RotateCcw } from 'lucide-react-native'
import { useResponsive } from './useLayout'
import Button from './Button'
import { Fonts } from '../themes/font'

type Props = {
  activeId: number | null
  onCategoryChange: (id: number | null) => void
}

type PillProps = {
  id: number | null
  name: string
  active: boolean
  onPress: (id: number | null) => void
  moderateScale: (n: number) => number
  scaleFont: (n: number) => number
}

const CategoryPill = React.memo(function CategoryPill({
  id, name, active, onPress, moderateScale, scaleFont
}: PillProps) {
  return (
    <Pressable
    disabled={active}
      onPress={() => onPress(id)}
      unstable_pressDelay={0}
      android_ripple={null}
      hitSlop={8}
      style={[
        active ? styles.activePress : styles.notActivePress,
        styles.pill,
        { paddingHorizontal: moderateScale(12), borderRadius: moderateScale(8) }
      ]}
    >
      <Text style={[styles.label, { fontSize: scaleFont(13) }, active && styles.activeText]}>
        {name}
      </Text>
    </Pressable>
  )
})

function CategoriesPills({ activeId, onCategoryChange }: Props) {
  const { data, isLoading, isError, refetch } = useGetMovieCategoriesQuery()
  const { moderateScale, scaleFont } = useResponsive()

  const handlePress = useCallback((id: number | null) => {
    onCategoryChange(activeId === id ? null : id)
  }, [activeId, onCategoryChange])

  if (isLoading) return <CategoryLoader />

  if (isError) return (
    <View style={styles.errorContainer}>
      <Button title="Retry" icon={RotateCcw} onPress={refetch} />
    </View>
  )

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
    >
      <View style={styles.row}>
        <CategoryPill
          id={null}
          name="All"
          active={activeId === null}
          onPress={handlePress}
          moderateScale={moderateScale}
          scaleFont={scaleFont}
        />
        {data?.genres
          .filter(cat => cat.name.toLowerCase() !== 'all')
          .map(cat => (
            <CategoryPill
              key={cat.id}
              id={cat.id}
              name={cat.name}
              active={activeId === cat.id}
              onPress={handlePress}
              moderateScale={moderateScale}
              scaleFont={scaleFont}
            />
          ))}
      </View>
    </ScrollView>
  )
}

export default React.memo(CategoriesPills)

const styles = StyleSheet.create({
  scroll: { marginTop: 8, marginBottom: 12, height: 35 },
  row: { flexDirection: 'row', gap: 8 },
  pill: { alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: Fonts.regular },
  activeText: { color: '#A82323' },
  activePress: { backgroundColor: '#eee5e5', borderColor: '#A82323', borderWidth: 0.5 },
  notActivePress: { borderWidth: 0.5, borderColor: 'gray', backgroundColor: 'white' },
  errorContainer: { height: 35, marginTop: 8, marginBottom: 12, alignItems: 'center' },
})