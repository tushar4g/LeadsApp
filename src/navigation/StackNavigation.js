import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../pages/home/Home'
import BottomTabNavigation from './BottomTabNavigation'
import EditProfile from '../pages/profile/EditProfile'
import Doctors from '../pages/doctor/Doctors'
import AddDoctor from '../pages/doctor/AddDoctor'
import ViewDoctorDetails from '../pages/doctor/ViewDoctorDetails'
import AddLead from '../pages/leads/AddLead'
import ViewLeadDetails from '../pages/leads/ViewLeadDetails'
import AddActivity from '../pages/leads/AddActivity'
import ChangePassword from '../pages/profile/pages/ChangePassword'
import Feedback from '../pages/profile/pages/Feedback'
import Rewards from '../pages/profile/pages/Rewards'

const StackNavigation = () => {
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false, animation:'slide_from_right',}}>
        <Stack.Screen name="Main" component={BottomTabNavigation} />
        <Stack.Screen name="Doctors" component={Doctors} />
        <Stack.Screen name="AddDoctor" component={AddDoctor} />
        <Stack.Screen name="ViewDoctorDetails" component={ViewDoctorDetails} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="AddLead" component={AddLead} />
        <Stack.Screen name="ViewLeadDetails" component={ViewLeadDetails} />
        <Stack.Screen name="AddActivity" component={AddActivity} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="Rewards" component={Rewards} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation