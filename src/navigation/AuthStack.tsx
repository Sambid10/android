import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from './navigationTypes';
const Stack = createNativeStackNavigator<AuthStackParamList>();
import AuthScreen from '../screens/AuthScreen/AuthScreen';
export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='Auth' component={AuthScreen}/>
    </Stack.Navigator>
  )
}
