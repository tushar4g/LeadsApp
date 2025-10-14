import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../pages/home/Home'
import BottomTabNavigation from './BottomTabNavigation'
import EditProfile from '../pages/profile/EditProfile'
import AddDoctor from '../pages/doctor/AddDoctor'

const StackNavigation = () => {
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false, animation:'slide_from_right',}}>
        <Stack.Screen name="Main" component={BottomTabNavigation} />
        <Stack.Screen name="AddDoctor" component={AddDoctor} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation