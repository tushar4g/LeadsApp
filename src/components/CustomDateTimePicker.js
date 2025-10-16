import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../style/Colors';

// Helper to format date or time
const formatValue = (date, mode) => {
  const d = new Date(date);
  if (mode === 'time') {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } else {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
};

const CustomDateTimePicker = ({ title, placeholder, value, setDate, maximumDate, minimumDate, flex=0, iconName, mode='date'  }) => {
    const [show, setShow] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShow(false);
        if (selectedDate) {
        setDate(selectedDate);
        }
    };

  return (
     <View style={[styles.main,{ gap: responsiveHeight(1.5), flex:flex}]}>
            {/* <Text style={styles.title}>{title}</Text> */}
            <View style={[styles.icon]}>
                <MaterialIcons name={iconName} size={responsiveFontSize(2.5)} color={Colors.blackWithOpacity} />
            </View>
            <Pressable onPress={() => setShow(true)} style={styles.calendar}>
                <Text style={[styles.inputBox, {color: value? Colors.textPrimary : Colors.textSecondary}]}>
                   {/* {value ? formatDate(value) : placeholder} */}
                   {value ? formatValue(value, mode) : placeholder}
                </Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    mode={mode}
                    maximumDate={maximumDate && maximumDate}
                    minimumDate={minimumDate && minimumDate}
                    value={value || new Date()}
                    display="default"
                    onChange={handleDateChange}
                    
                />
            )}
    </View>
  )
}

export default CustomDateTimePicker

const styles = StyleSheet.create({
    main:{
        width: '100%',
        height: responsiveHeight(4.8),
        borderColor: Colors.gray,
        borderWidth: responsiveWidth(0.3),
        borderRadius: responsiveWidth(2),
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: responsiveHeight(1.5),
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: '600',
    },
    icon: {
        backgroundColor: Colors.white,
        paddingLeft: responsiveWidth(3),
        paddingVertical: responsiveHeight(1),
    },
    calendar:{
        flex: 1,
    },
    inputBox: {
        fontSize: responsiveFontSize(1.6),
        backgroundColor: Colors.white,
    },
});