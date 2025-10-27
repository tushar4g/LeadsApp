import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text, View  } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from '../style/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import  MaterialIcons  from '@react-native-vector-icons/material-icons';


const MyHeader = ({ title, onBackPress, onFabPress, fabTitle, rightComponent, rewardInfo, rewardInfoPress  }) => {
  return (
    <Appbar.Header style={styles.header}>
        {/* {onBackPress && <Appbar.BackAction onPress={onBackPress} color={Colors.primary} />} */}
        {onBackPress && 
        <TouchableOpacity onPress={onBackPress} style={{ paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveHeight(1),marginRight: responsiveWidth(2) }}>
          <MaterialIcons name="arrow-back" size={responsiveFontSize(2.4)} color={Colors.black} />
        </TouchableOpacity>
        }
        <Appbar.Content title={title} titleStyle={[styles.title,{paddingLeft: onBackPress ? responsiveWidth(0) : responsiveWidth(1)}]} />
        {onFabPress && (
          <TouchableOpacity onPress={onFabPress} style={styles.fabButton}>
            <MaterialIcons name="add" size={responsiveFontSize(2.4)} color={Colors.white} />
            <Text style={styles.fabText}>{fabTitle}</Text>
          </TouchableOpacity>
        )}
        {rightComponent && rightComponent}
        {rewardInfo && 
          <TouchableOpacity onPress={rewardInfoPress} style={{ flexDirection: 'row', alignItems: 'center',paddingRight: responsiveWidth(2) }}>
            {/* <Icon name="information-outline" size={responsiveFontSize(2.2)} color={Colors.primary} /> */}
            {/* <Text style={{ color: Colors.primary , fontSize: responsiveFontSize(1.8) }}>Info</Text> */}
          </TouchableOpacity>
        }
    </Appbar.Header>
  )
}

export default MyHeader

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    // height: responsiveHeight(10), // Reduced height
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: responsiveFontSize(2),
    color: Colors.black,
    fontWeight: 'bold',
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: responsiveWidth(12),
    marginRight: responsiveWidth(3),
    gap: responsiveWidth(1),
  },
  fabText:{
    fontSize: responsiveFontSize(1.4),
    color: Colors.white,
    fontWeight: 'bold'
  },
});