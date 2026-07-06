import { Image, View, Text, Pressable } from "react-native"
import { Fonts } from "../themes/font"
import { Search } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/navigationTypes"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useResponsive } from "./useLayout"
import { getAuth } from '@react-native-firebase/auth';
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
type Nav = NativeStackNavigationProp<RootStackParamList>


export default function Header() {
  const currentuser = useSelector((state:RootState)=>state.user.user)
  const navigation = useNavigation<Nav>()
  const { moderateScale, scaleFont } = useResponsive()

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: moderateScale(8), alignItems: "center" }}>
          <Image
            style={{ borderRadius: 99, height: moderateScale(44), width: moderateScale(44), borderWidth: 0.5 }}
            source={{uri:currentuser?.photourl}}
          />
          <View>
            <Text style={{ color: "#A82323", fontFamily: Fonts.semiBold, fontSize: scaleFont(13) }}>Hello,</Text>
            <Text style={{ color: "#000", fontFamily: Fonts.regular, fontSize: scaleFont(16) }}>{currentuser?.name}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Search")}
          style={({ pressed }) => ({
            alignItems: "center",
            paddingRight: moderateScale(6),
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Search size={moderateScale(26)} />
          <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(11) }}>Search</Text>
        </Pressable>
      </View>
    </>
  )
}
