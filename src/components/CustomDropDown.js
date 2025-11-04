import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {responsiveFontSize, responsiveHeight, responsiveWidth,} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import  MaterialIcons  from '@react-native-vector-icons/material-icons';
import {Dropdown} from 'react-native-element-dropdown';
import Colors from '../style/Colors';

const CustomDropDown = ({title, uprLabel, value, setValue, gap, search= false, iconName, renderLeftIcon = true, data, placeholder, dropdownPosition = 'auto', disabled = false,}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [tempValue, setTempValue] = useState(null);
  
  const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.uprLabel, isFocus && { color: Colors.primary }, { backgroundColor: 'white' }]}>
                    {uprLabel}
                </Text>
            );
        }
        return null;
    };

 const handleFocus = () => {
    setTempValue(value); // save original value
    setIsFocus(true);
  };

  const handleBlur = () => {
    setIsFocus(false);
    // if nothing selected during dropdown open, restore previous
    if (!value && tempValue) {
      setValue(tempValue);
    }
  };

  const renderLeftIconFn = () => {
  if (iconName) {
    return (
      <MaterialIcons
        name={iconName}
        size={responsiveFontSize(2.5)}
        color={Colors.blackWithOpacity}
        style={styles.icon}
      />
    );
  } else if (renderLeftIcon) {
    return (
      <MaterialIcons
        name="Safety"
        size={responsiveFontSize(2.5)}
        color={Colors.primaryDropDownOpacity}
        style={styles.icon}
      />
    );
  }
  return null;
};



  return (
   <View style={[styles.main, {}, ]}>
      {/* <Text style={styles.label}>{title}</Text> */}
      <View  pointerEvents={disabled ? 'none' : 'auto'} style={[styles.inputContainer,{ zIndex: isFocus ? 10 : 1 }, disabled && { borderColor: '#d8d8d8' },]}>
        {renderLabel()}
        <Dropdown
          disabled={disabled}
          style={[styles.dropdown, isFocus && { borderColor: Colors.primary, borderWidth: responsiveWidth(0.5) }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={[{fontSize: responsiveFontSize(1.6),}, disabled && { color: '#a0a0a0' }]}
          inputSearchStyle={{fontSize: responsiveFontSize(1.6),}}
          iconStyle={styles.iconStyle}
          data={data}
          search={search} 
          maxHeight={responsiveHeight(27)} 
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? uprLabel : '...'}
          searchPlaceholder="Search..."
          // value={isFocus ? null : value}
          value={value}
          dropdownPosition={dropdownPosition}
          // onFocus={() => setIsFocus(true)}
          // onBlur={() => setIsFocus(false)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false)
          }}
          // Add these properties to improve dropdown behavior
          activeColor={Colors.primaryWithExtraOpacity} // Highlight color for selected item
          containerStyle={styles.dropdownContainer} // Custom container style
          renderItem={(item, selected) => (
            <View style={[styles.dropdownItem, selected && styles.selectedItem]}>
              <Text style={[styles.dropdownItemText, selected && styles.selectedItemText]}>
                {item.label}
              </Text>
            </View>
          )}
          renderLeftIcon={renderLeftIconFn}
        />
      </View>
    </View>
  )
}

export default CustomDropDown

const styles = StyleSheet.create({
  main: {
    // marginBottom: responsiveHeight(1.5),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.tertiary,
  },
  icon: {
    // backgroundColor: Colors.error,
    // padding: responsiveWidth(2.3),
    marginRight: responsiveWidth(4.2),
  },
  inputContainer: {
    // width: '100%',
    // borderColor: Colors.primaryDropDownOpacity,
    // borderWidth: 1,
    // borderRadius: responsiveWidth(2),
    // flexDirection: 'row',
    // alignItems: 'center',
    // overflow: 'hidden',

  },
  dropdown: {
    // flex: 1,
    // paddingRight: responsiveWidth(1),
    // marginLeft: responsiveWidth(1.6),
    height: responsiveHeight(4.8),
    borderColor: Colors.gray,
    borderWidth: responsiveWidth(0.3),
    borderRadius: responsiveFontSize(1),
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: Colors.white,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textSecondary,
  },
  
  iconStyle: {
    width: responsiveWidth(4),
    height: responsiveHeight(2.5),
  },
  // New styles for dropdown items
  dropdownContainer: {
    borderRadius: responsiveWidth(2),
    borderWidth: 0.2,
    borderColor: Colors.primaryWithExtraOpacity,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.white,
    // position: 'absolute',
    zIndex: 1000,
    marginTop: 0, // Ensure no top margin pushes it up
    maxHeight: responsiveHeight(25), // Limit maximum height to 25% of screen height
  },
  dropdownItem: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1),
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.primaryWithExtraOpacity,
    // height: responsiveHeight(5), // Fixed height for each item
    justifyContent: 'center', // Center content vertically
    
  },
  selectedItem: {
    backgroundColor: Colors.primaryWithExtraOpacity,
  },
  dropdownItemText: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textPrimary,
  },
  selectedItemText: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },

  uprLabel: {
        position: 'absolute',
        backgroundColor: Colors.white,
        left: responsiveWidth(2.3),
        top: -responsiveHeight(1.2),
        color: Colors.primaryDropDownOpacity,
        paddingHorizontal: responsiveWidth(1.3),
        fontSize: responsiveFontSize(1.4),
        zIndex: 2001,
    },
});