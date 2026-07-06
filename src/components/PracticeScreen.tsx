import React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const data = Array.from({ length: 30 }, (_, index) => ({
  id: `${index + 1}`,
  title: `Video ${index + 1}`,
}))

const HeaderComponent = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>YouTube Header</Text>
  </View>
)

const renderItem = ({
  item,
}: {
  item: { id: string; title: string }
}) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{item.title}</Text>
  </View>
)

const keyExtractor = (item: { id: string }) => item.id

export default function PracticeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={HeaderComponent}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  item: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },

  itemText: {
    fontSize: 16,
  },
})