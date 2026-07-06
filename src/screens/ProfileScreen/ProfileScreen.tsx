import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { Fonts } from '../../themes/font'
import { useResponsive } from '../../components/useLayout'
import { ChevronRight, HelpCircle, Link2, LogOutIcon, LucideIcon, User } from 'lucide-react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../redux/store'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { clearUser } from '../../redux/slices/userSlice'

interface MenuRowProps {
  icon: LucideIcon
  title: string
  subtitle: string
  scaleFont: (size: number) => number
  onPress?: () => void
}

interface MenuItemConfig {
  icon: LucideIcon
  title: string
  subtitle: string
  onPress?: () => void
}

interface MenuSectionProps {
  title: string
  items: MenuItemConfig[]
  scaleFont: (size: number) => number
}

function MenuRow({ icon: Icon, title, subtitle, scaleFont, onPress }: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "rgba(168, 35, 35, 0.08)" : "white",
        padding: 14,
        borderRadius: 8,
        width: "100%",
        borderColor: "gray",
        borderWidth: 0.5,
        flexDirection: "row",
        alignItems: "center",
      })}
    >
      <Icon />
      <View style={{ marginLeft: 12 }}>
        <Text style={{ fontFamily: Fonts.semiBold, fontSize: scaleFont(14) }}>{title}</Text>
        <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(12), color: "gray" }}>{subtitle}</Text>
      </View>
      <View style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <ChevronRight />
      </View>
    </Pressable>
  )
}

function MenuSection({ title, items, scaleFont }: MenuSectionProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: Fonts.semiBold, fontSize: scaleFont(18), color: "#A82323" }}>{title}</Text>
      <View style={{ gap: 12, width: "100%" }}>
        {items.map((item, index) => (
          <MenuRow
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            scaleFont={scaleFont}
            onPress={item.onPress}
          />
        ))}
      </View>
    </View>
  )
}

export default function ProfileScreen() {
  const currentUser = useSelector((state: RootState) => state.user.user)
  const dispatch = useDispatch<AppDispatch>()
  const { scaleFont } = useResponsive()

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      dispatch(clearUser());
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const accountItems: MenuItemConfig[] = [
    { icon: User, title: "Personal Information", subtitle: "Manage your account details" },
    { icon: Link2, title: "Linked Accounts", subtitle: "Sync your account" },
  ]

  const generalItems: MenuItemConfig[] = [
      { icon: HelpCircle, title: "Help Center", subtitle: "Read our guides here" },
    { icon: LogOutIcon, title: "Logout", subtitle: "You have to sign in again", onPress: handleLogout },
  
  ]

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 12, paddingTop: 6 }}>
      <View style={{ flex: 1, alignItems: "center", gap: 12 }}>
        <View style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 110, width: 110 }}>
          <View style={{ width: "100%", borderRadius: 99, height: "100%", position: "absolute", borderWidth: 0.5, borderColor: "black" }} />
          <Image
            source={{ uri: currentUser?.photourl }}
            style={{ height: 100, width: 100, borderRadius: 99 }}
          />
        </View>
        <View style={{ display: "flex", alignItems: "center", marginTop: -6 }}>
          <Text style={{ fontFamily: Fonts.semiBold, fontSize: scaleFont(18) }}>{currentUser?.name}</Text>
          <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(14) }}> {currentUser?.email}</Text>
        </View>
        <View style={{ display: "flex", alignItems: "flex-start", width: "100%", gap: 12 }}>
          <MenuSection title="Account" items={accountItems} scaleFont={scaleFont} />
          <MenuSection title="General" items={generalItems} scaleFont={scaleFont} />
        </View>
      </View>
    </ScrollView>
  )
}