import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useGetMovieDetailsQuery } from '../../redux/api/movie/movieApi'
import { Loader } from '../../components/Loaders/Loader'
import { useResponsive } from '../../components/useLayout'
import { Fonts } from '../../themes/font'
import {
  Star,
  Clock,
  Calendar,
  DollarSign,
  Globe,
  ChevronLeft,
} from 'lucide-react-native'

export default function DetailsScreen() {
  const route     = useRoute()
  const navigation = useNavigation()
  const { id }    = route.params as { id: number }
  const { moderateScale, scaleFont, verticalScale } = useResponsive()

  const { data, isLoading } = useGetMovieDetailsQuery(id!, { skip: id === null })

  if (isLoading) return <Loader />

  if (!data) return (
    <View style={styles.centered}>
      <Text>Movie not found.</Text>
    </View>
  )

  const formatMoney = (n: number) =>
    n > 0 ? `$${n.toLocaleString()}` : 'N/A'

  const formatRuntime = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* backdrop */}
      <View>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w780${data.backdrop_path}` }}
          style={{ width: '100%', height: verticalScale(220) }}
        />

        {/* back button */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => ({
            position:        'absolute',
            top:             moderateScale(16),
            left:            moderateScale(16),
            backgroundColor: pressed ? '#A82323' : 'rgba(0,0,0,0.5)',
            borderRadius:    moderateScale(20),
            padding:         moderateScale(6),
          })}
        >
          <ChevronLeft size={moderateScale(22)} color="white" />
        </Pressable>

        {/* poster overlapping the backdrop */}
        <View style={{
          position:   'absolute',
          bottom:     -verticalScale(60),
          left:       moderateScale(16),
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation:  8,
        }}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w342${data.poster_path}` }}
            style={{
              width:              moderateScale(90),
              height:             verticalScale(130),
              borderRadius:       moderateScale(8),
            }}
          />
        </View>
      </View>

      {/* content */}
      <View style={{ paddingHorizontal: moderateScale(16), paddingTop: verticalScale(70) }}>

        {/* title + tagline */}
        <Text style={{ fontFamily: Fonts.semiBold, fontSize: scaleFont(22), color: '#1a1a1a' }}>
          {data.title}
        </Text>
        {data.tagline ? (
          <Text style={{
            fontFamily: Fonts.regular,
            fontSize:   scaleFont(13),
            color:      '#020101',
            marginTop:  moderateScale(4),
            fontStyle:  'italic',
          }}>
            "{data.tagline}"
          </Text>
        ) : null}

        {/* rating + runtime + date */}
        <View style={{
          flexDirection:  'row',
          gap:            moderateScale(16),
          marginTop:      moderateScale(12),
          flexWrap:       'wrap',
        }}>
          <Row icon={<Star size={14} stroke="#F59E0B" fill="#F59E0B" />}
               label={data.vote_average.toFixed(1)}
               sub={`(${data.vote_count.toLocaleString()} votes)`}
               scaleFont={scaleFont} />

          <Row icon={<Clock size={14} color="#A82323" />}
               label={formatRuntime(data.runtime)}
               scaleFont={scaleFont} />

          <Row icon={<Calendar size={14} color="#A82323" />}
               label={data.release_date}
               scaleFont={scaleFont} />
        </View>

        {/* genres */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(8), marginTop: moderateScale(14) }}>
          {data.genres?.map(g => (
            <View key={g.id} style={{
              backgroundColor: '#A82323',
              borderRadius:    moderateScale(20),
              paddingHorizontal: moderateScale(12),
              paddingVertical:   moderateScale(4),
            }}>
              <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(12), color: 'white' }}>
                {g.name}
              </Text>
            </View>
          ))}
        </View>

        {/* overview */}
        <Text style={{
          fontFamily: Fonts.semiBold,
          fontSize:   scaleFont(16),
          marginTop:  moderateScale(20),
          color:      '#1a1a1a',
        }}>
          Overview
        </Text>
        <Text style={{
          fontFamily:  Fonts.regular,
          fontSize:    scaleFont(14),
          color:       '#444',
          marginTop:   moderateScale(6),
          lineHeight:  scaleFont(22),
        }}>
          {data.overview}
        </Text>

        {/* budget / revenue */}
        <View style={{
          flexDirection:    'row',
          gap:              moderateScale(12),
          marginTop:        moderateScale(20),
        }}>
          <StatBox
            label="Budget"
            value={formatMoney(data.budget)}
            icon={<DollarSign size={16} color="#e5e5e5" />}
            moderateScale={moderateScale}
            scaleFont={scaleFont}
          />
          <StatBox
            label="Revenue"
            value={formatMoney(data.revenue)}
            icon={<DollarSign size={16} color="#e5e5e5" />}
            moderateScale={moderateScale}
            scaleFont={scaleFont}
          />
        </View>

        {/* production companies */}
        {data.production_companies?.length > 0 && (
          <>
            <Text style={{
              fontFamily: Fonts.semiBold,
              fontSize:   scaleFont(16),
              marginTop:  moderateScale(20),
              color:      '#1a1a1a',
            }}>
              Production
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(8), marginTop: moderateScale(8) }}>
              {data.production_companies.map(c => (
                <View key={c.id} style={{
                  borderWidth:      1,
                  borderColor:      '#e0e0e0',
                  borderRadius:     moderateScale(8),
                  paddingHorizontal: moderateScale(12),
                  paddingVertical:   moderateScale(6),
                  flexDirection:    'row',
                  alignItems:       'center',
                  gap:              moderateScale(6),
                }}>
                  <Globe size={12} color="#A82323" />
                  <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(12), color: '#444' }}>
                    {c.name}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: verticalScale(32) }} />
      </View>
    </ScrollView>
  )
}

// ── small helpers ─────────────────────────────────────────────────────────────

function Row({ icon, label, sub, scaleFont }: {
  icon: React.ReactNode
  label: string
  sub?: string
  scaleFont: (n: number) => number
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {icon}
      <Text style={{ fontFamily: Fonts.semiBold, fontSize: scaleFont(13), color: '#1a1a1a' }}>
        {label}
      </Text>
      {sub ? (
        <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(11), color: '#888' }}>
          {sub}
        </Text>
      ) : null}
    </View>
  )
}

function StatBox({ label, value, icon, moderateScale, scaleFont }: {
  label: string
  value: string
  icon: React.ReactNode
  moderateScale: (n: number) => number
  scaleFont: (n: number) => number
}) {
  return (
    <View style={{
      flex:              1,
      backgroundColor:   '#A82323',
      borderRadius:      moderateScale(10),
      padding:           moderateScale(12),
      gap:               moderateScale(4),
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {icon}
        <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(11), color: '#e5e5e5' }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontFamily: Fonts.semiBold, fontSize: scaleFont(14), color: '#ffffff' }}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
})