import { View, Text } from 'react-native'
import React from 'react'
import MyHeader from '../../components/MyHeader'

const AddDoctor = ({navigation}) => {
  return (
    <View>
      <MyHeader title={'Add Doctor'} onBackPress={() => navigation.goBack()} />
    </View>
  )
}

export default AddDoctor