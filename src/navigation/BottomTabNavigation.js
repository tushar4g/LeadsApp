import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Home from '../pages/home/Home'
import HomePage from '../pages/home/HomePage'
import Profile from '../pages/profile/Profile'
import Leads from '../pages/leads/Leads'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import  MaterialIcons  from '@react-native-vector-icons/material-icons';
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
    // Custom tab bar icons and labels
    const getTabBarIcon = (route, focused) => {
    let iconName;

    // if (route.name === 'Home') {
    //     iconName = focused ? 'home' : 'home-outline';
    // } else if (route.name === 'HomePage') {
    //     iconName = focused ? 'sale' : 'sale';
    // } else if (route.name === 'Blood Bank') {
    //     iconName = focused ? 'water' : 'water-outline';
    // } else if (route.name === 'Transaction') {
    //     iconName = focused ? 'wallet' : 'wallet-outline';
    // } else if (route.name === 'Profile') {
    //     iconName = focused ? 'account-circle' : 'account-circle-outline';
    // }

    if (route.name === 'Home') {
      iconName = 'home';
    } else if (route.name === 'HomePage') {
      iconName = 'home';
    } else if (route.name === 'Leads') {
      iconName = 'opacity';
    } else if (route.name === 'Transaction') {
      iconName = 'account-balance-wallet';
    } else if (route.name === 'Profile') {
      iconName = 'account-circle';
    }

    return iconName;
    };

// Get color for each tab
    const getTabColor = (routeName) => {
    switch (routeName) {
        case 'Home':
        return 'red';
        case 'HomePage':
            return 'blue';
        case 'Leads':
            return 'green';
        case 'Transaction':
            return 'orange';
        case 'Profile':
            return 'purple';
        default:
            return 'black';
    }
    };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: getTabColor(route.name),
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
            const iconName = getTabBarIcon(route, focused);
            return (
                <View style={styles.iconContainer}>
                    <MaterialIcons name={iconName} size={size} color={color} />
                </View>
            );
        },
        // tabBarStyle: {
        //   position: 'absolute',
        //   bottom: responsiveHeight(2),
        //   left: responsiveWidth(5),
        //   right: responsiveWidth(5),
        //   height: responsiveHeight(8),
        //   borderRadius: 10,
        //   ...styleShadow.shadow,
        // },
        tabBarStyle: {
            height: responsiveHeight(6),
            paddingVertical: responsiveHeight(0.5),
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
        },
      })}
    >
      {/* Add your Tab.Screen components here */}
      <Tab.Screen name="HomePage" component={HomePage} />
      <Tab.Screen name="Leads" component={Leads} />
      {/* <Tab.Screen name="Home" component={Home} /> */}
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
export default BottomTabNavigation;

const styleShadow = {
  // shadow: {
  //   elevation: 5,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  // },
};


const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(12),
    height: responsiveHeight(3),
  },
  indicator: {
    position: 'absolute',
    bottom: responsiveHeight(-1.6),
    width: responsiveWidth(5),
    // height: responsiveHeight(0.4),
    borderRadius: 4,
  },
  tabLabel: {
    fontWeight: '500',
    marginTop: responsiveHeight(-0.3),
    textAlign: 'center',
    fontSize: responsiveFontSize(1),
    // color: Colors.tertiary,
    color: 'grey'
  },
});
