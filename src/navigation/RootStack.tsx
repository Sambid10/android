import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootNaviagtion } from './RootNaviagtion';
import DetailsScreen from '../screens/DetailsScreen/DetailsScreen';
import { RootStackParamList } from './navigationTypes';
import SearchScreen from '../screens/SearchScreen/SearchScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={RootNaviagtion} />
      <Stack.Screen name='VacationDetail' component={DetailsScreen}/>
      <Stack.Screen
       options={{ animation: 'none' }}
       name='Search' component={SearchScreen}/>
    </Stack.Navigator>
  );
}