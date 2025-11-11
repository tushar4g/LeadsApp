import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {responsiveFontSize, responsiveHeight, responsiveWidth,} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { MultiSelect } from 'react-native-element-dropdown';
import Colors from '../style/Colors';

const CustomMultipleDropdown = ({title, uprLabel, value, setValue, gap, iconName, data, placeholder, dropdownPosition = 'auto', disabled = false,}) => {
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
        return (
            <Text style={[styles.uprLabel, isFocus && { color: Colors.primary, }, { backgroundColor: 'white' }]}>
            {uprLabel}
            </Text>
        )
        }
        return null;
    }

  return (
    <View style={[styles.main, { gap: gap }]}>
        {/* <Text style={styles.label}>{title}</Text> */}
        <View  pointerEvents={disabled ? 'none' : 'auto'} style={[styles.inputContainer,{ zIndex: isFocus ? 10 : 1 }, disabled && { borderColor: '#d8d8d8' }, value?.length > 0 && { paddingVertical: responsiveHeight(0) },]}>
            {renderLabel()}
            <MultiSelect
                disabled={disabled}
                style={[styles.dropdown,]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={[styles.selectedTextStyle, disabled && { color: '#a0a0a0' }]}
                iconStyle={styles.iconStyle}
                search
                data={data}
                maxHeight={responsiveHeight(27)} // Use responsive height instead of fixed value
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? uprLabel : '...'}
                searchPlaceholder="Search..."
                value={value}
                dropdownPosition={dropdownPosition}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item);
                    setIsFocus(false);
                }}
                activeColor={Colors.primaryWithExtraOpacity} // Highlight color for selected item
                containerStyle={styles.dropdownContainer} // Custom container style
                renderItem={(item, selected) => (
                    <View style={[styles.dropdownItem, selected && styles.selectedItem]}>
                    <Text style={[styles.dropdownItemText, selected && styles.selectedItemText]}>
                        {item.label}
                    </Text>
                    </View>
                )}
                selectedStyle={styles.selectedStyle}
                renderSelectedItem={(item, unSelect) => (
                    <View style={styles.tagItem} key={item.value}>
                    <Text style={styles.tagText}>{item.label}</Text>
                    {/* <MaterialCommunityIcons name="close" size={responsiveFontSize(2)} color={Colors.primary} onPress={unSelect} /> */}
                    </View>
                )}
                renderLeftIcon={
                    iconName ? () => (
                    <MaterialCommunityIcons name={iconName} size={responsiveFontSize(2.5)} color={Colors.primaryDropDownOpacity} style={styles.icon} />
                    ) : renderLeftIcon 
                    ? () => (
                    <MaterialCommunityIcons name="Safety" size={responsiveFontSize(2.5)} color={Colors.primaryDropDownOpacity} style={styles.icon} />
                    ) : undefined
                }
            />
        </View>
    </View>
  )
}

export default CustomMultipleDropdown

const styles = StyleSheet.create({
    main: {
        marginBottom: responsiveHeight(1.5),
    },
    label: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.tertiary,
    },
    icon: {
        // backgroundColor: Colors.white,
        // padding: responsiveWidth(2.3),
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignSelf: 'flex-start',
        marginRight: responsiveWidth(5.2),
    },
    inputContainer: {
        // width: '100%',
        // borderColor: Colors.primary,
        // borderWidth: 1,
        // borderRadius: responsiveWidth(2),
        // flexDirection: 'row',
        // alignItems: 'center',   
        // flexWrap: 'wrap',
        // // paddingVertical: responsiveHeight(1),
        // paddingHorizontal: responsiveWidth(2),
        // // minHeight: responsiveHeight(7),
    },
    dropdown: {
        // flex: 1,
        // flexWrap: 'wrap', 
        // paddingHorizontal: responsiveWidth(1),
        // // marginLeft: responsiveWidth(1),
        // justifyContent: 'center',
        // flex: 1,
        // flexWrap: 'wrap', 
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
    selectedTextStyle: {
        fontSize: responsiveFontSize(1.6),
        // color: Colors.black,
    },
    iconStyle: {
        width: responsiveWidth(4),
        height: responsiveHeight(2.5),
        // paddingRight: responsiveWidth(7),
    },
    dropdownContainer: {
        borderRadius: responsiveWidth(2),
        borderWidth: 1,
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
        borderBottomWidth: 1,
        borderBottomColor: Colors.primaryWithExtraOpacity,
        height: responsiveHeight(5), // Fixed height for each item
        justifyContent: 'center', // Center content vertically   
    },
    selectedItem: {
        backgroundColor: Colors.primaryWithExtraOpacity,
    },
    dropdownItemText: {
        fontSize: responsiveFontSize(1.6),
        color: Colors.primary,
    },
    selectedItemText: {
        color: Colors.primary,
        fontWeight: '500',
    },
    selectedStyle: {
        borderRadius: responsiveWidth(2),
        backgroundColor: Colors.primaryWithExtraOpacity,
        padding: responsiveWidth(0.5),
        margin: responsiveHeight(0.5),
    },
    tagItem: {
        backgroundColor: Colors.primaryWithExtraOpacity,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(0.5),
        borderRadius: responsiveWidth(5),
        margin: 3,
    },
    tagText: {
        fontSize: responsiveFontSize(1.5),
        color: Colors.primary,
        fontWeight: '500',
    },
    uprLabel: {
        position: 'absolute',
        backgroundColor: Colors.white,
        left: responsiveWidth(2.3),
        top: -responsiveHeight(1.2),
        color: Colors.primary,
        paddingHorizontal: responsiveWidth(1.3),
        fontSize: responsiveFontSize(1.6),
        zIndex: 2001,
    },
});