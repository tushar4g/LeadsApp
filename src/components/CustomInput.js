import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import  MaterialIcons  from '@react-native-vector-icons/material-icons';
import { TextInput } from 'react-native-paper';
import Colors from '../style/Colors';

const CustomInput = ({ label, value, onChangeText, icon, editable = true, keyboardType = 'default', placeholder, isPassword = false, maxLength }) => {
  const [secure, setSecure] = useState(isPassword);
 

  return (
     <View>
        <TextInput
            label={label}
            mode="outlined"
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            keyboardType={keyboardType}
            // placeholder={placeholder}
            secureTextEntry={secure}
            maxLength={maxLength}
            style={[styles.input,]}
            outlineColor={Colors.gray} 
            activeOutlineColor={Colors.primary}
            left={
              icon
                ? <TextInput.Icon icon={({ size, color }) => (
                    <MaterialIcons name={icon} size={responsiveFontSize(2.5)} color={Colors.blackWithOpacity} />
                  )} />
                : null
            }
            right={
              isPassword && (
                <TextInput.Icon
                  icon={secure ? 'eye-off' : 'eye'}
                  onPress={() => setSecure(!secure)}
                  color={Colors.primaryDropDownOpacity}
                />
              )
            }
            theme={{ 
                roundness: responsiveWidth(2),  
                colors: {
                    primary: Colors.primary,            // Focused label and border
                    text: Colors.primary,               // Input text color
                    placeholder: Colors.tertiary,       // Label color when unfocused
                    onSurfaceVariant: Colors.textSecondary,   // Unfocused label color (important!)
                    onSurface: Colors.textPrimary,          // Used for text/border sometimes
                },
            }}  
        />
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({
  main: {
    width:'100%',
    gap: responsiveWidth(1),
  },
  input: {
    // marginBottom: responsiveHeight(1.5),
    backgroundColor: Colors.white,
    height: responsiveHeight(4.5), // Add or adjust this line for desired height
    fontSize: responsiveFontSize(1.6),
  },
})