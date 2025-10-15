import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import Colors from '../style/Colors'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'

const CustomButton = ({title, color= Colors.white, bgColor = Colors.primary, borderC = Colors.primary, onPress, isLoading = false,}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.main, {backgroundColor: bgColor, borderColor: borderC}]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
          <Text style={[styles.btnText, {color: color}]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.primary,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(6),
    justifyContent:'center',
    alignItems:'center',
    borderColor: Colors.primary,
    borderWidth:1,
  },
  btnText:{
    fontSize: responsiveFontSize(1.8),
    color: Colors.white,
    fontWeight: 'bold',
  },
})