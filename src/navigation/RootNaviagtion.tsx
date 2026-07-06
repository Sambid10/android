import { View, StyleSheet } from 'react-native';
import { Text } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import { Home, User, Heart, List } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Fonts } from '../themes/font';
import { Pressable } from 'react-native';
import ScheduleScreen from '../screens/ScheduleScreen/ScheduleScreen';
import FavouriteScreen from '../screens/FavouriteScreen/FavouriteScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import { BottomTabsParamList } from './navigationTypes';
import { useResponsive } from '../components/useLayout';

function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { moderateScale, scaleFont } = useResponsive();

  return (
    <View style={styles.outerWrapper}>
      {/* main pill — all tabs except Favourites */}
      <View style={[styles.tabContainer, { paddingVertical: moderateScale(8), paddingHorizontal: moderateScale(8) }]}>
        {state.routes
          .filter(route => route.name !== 'Favourites')
          .map((route) => {
            const isFocused = state.routes.indexOf(route) === state.index;
            const { options } = descriptors[route.key];
            const iconColor = isFocused ? "#A82323" : "#000";
            const icon = options.tabBarIcon
              ? options.tabBarIcon({ color: iconColor, size: moderateScale(22), focused: isFocused })
              : null;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            };

            return (
              <Pressable key={route.key} onPress={onPress} style={styles.tabButton}>
                <View style={[styles.tabAccent, isFocused && styles.tabAccentActive, { paddingVertical: moderateScale(10) }]}>
                  {icon}
                </View>
              </Pressable>
            );
          })}
      </View>

      {/* second pill — only Favourites */}
      <View style={[styles.favContainer, { paddingVertical: moderateScale(4) }]}>
        {state.routes
          .filter(route => route.name === 'Favourites')
          .map((route) => {
            const isFocused = state.routes.indexOf(route) === state.index;
            const { options } = descriptors[route.key];
            const iconColor = isFocused ? "white" : "white";
            const icon = options.tabBarIcon
              ? options.tabBarIcon({ color: iconColor, size: moderateScale(22), focused: isFocused })
              : null;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            };

            return (
              <Pressable key={route.key} onPress={onPress} style={styles.tabButton}>
                <View style={[styles.tabAccent, isFocused && styles.tabAccentActive, { paddingVertical: moderateScale(10) }]}>
                  {icon}
                </View>
              </Pressable>
            );
          })}
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export function RootNaviagtion() {
  const { moderateScale } = useResponsive();

  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Home size={moderateScale(26)} color={color} strokeWidth={1.3} />,
        }}
        name="Home" component={HomeScreen} />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <User size={moderateScale(26)} color={color} strokeWidth={1.3} />,
        }}
        name="Profile" component={ProfileScreen} />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Heart size={moderateScale(26)} color={color} strokeWidth={1.3} />,
        }}
        name="Favourites" component={FavouriteScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  tabContainer: {
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    borderRadius: 99,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    gap: 4,
    elevation: 4,
    borderWidth:0.5,
    borderColor:"gray"
  },
  favContainer:{
    backgroundColor: "#c73434",
    flexDirection: "row",
    borderRadius: 8,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    gap: 4,
    elevation: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
    overflow: 'hidden',
  },
  tabAccent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
  tabAccentActive: {
    backgroundColor: 'rgba(168, 35, 35, 0.08)',
  },
  tabText: {
    fontFamily: Fonts.semiBold,
  },
});