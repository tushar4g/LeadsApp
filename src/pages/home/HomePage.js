import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../style/Colors';
// import { updateDistance } from '../../redux/slices/userSlice';
import { ImageSlider } from '@pembajak/react-native-image-slider-banner';
import { useDispatch, useSelector } from 'react-redux';


const initialImages = [
  { img: 'https://storage.pixteller.com/designs/designs-images/2019-05-15/11/customizable-hospital-banner-ad-1-5cdbd3f3e2c28.png' }, // direct PNG
  { img: 'https://via.placeholder.com/1200x600.png?text=Hospital+Banner+1' },
  { img: 'https://storage.pixteller.com/designs/designs-images/2019-05-15/11/customizable-hospital-banner-ad-1-5cdbd3f3e2c28.png' },
  { img: 'https://via.placeholder.com/1200x600.png?text=Hospital+Banner+3' },
];


const HomePage = ({navigation}) => {
  const { name, userID } = useSelector((state) => state.user);  
  const [selectedTab, setSelectedTab] = useState('Yesterday');
  const [sliderImage, setSliderImage] = useState(initialImages);
  // const [sliderImage, setSliderImage] = useState(
  //   initialImages.filter(item => item && item.img && item.img.trim().length > 0)
  // );

  const statsTabs = ['Yesterday', 'This Week', 'This Month'];
  // 👇 Data that changes with tab
  const statsData = {
    Yesterday: {
      distance: '311.17 km',
      desc: 'Every distance counts towards sealing the deal',
      icon: 'two-wheeler', // ✅ closest to motorbike
      color: '#6366F1',
    },
    'This Week': {
      distance: '1,245.52 km',
      desc: 'Consistency brings results — keep going!',
      icon: 'directions-car', // ✅ replaces 'car'
      color: '#10B981',
    },
    'This Month': {
      distance: '4,872.85 km',
      desc: 'A journey of success measured in kilometers!',
      icon: 'alt-route', // ✅ replaces 'road-variant'
      color: '#F59E0B',
    },
  };


  const currentData = statsData[selectedTab];

  const quickLaunchItems = [
  { icon: 'person-add-alt', label: 'New Doctor Form', screen: 'AddDoctor'},        // account-plus-outline → person-add-alt
  { icon: 'event-available', label: 'New Camp', screen: 'AddCamp'},              // calendar-plus → event-available
  { icon: 'place', label: 'Visit Plan', screen: 'VisitPlan'},                      // map-marker-outline → place
  { icon: 'playlist-add', label: 'Create Task', screen: 'CreateTask'},              // clipboard-plus-outline → playlist-add
  { icon: 'help-outline', label: 'Help', screen: 'Help'},                     // help-circle-outline → help-outline
  { icon: 'group-add', label: 'Add CVIP', screen: 'AddCVIP'},                    // account-multiple-plus-outline → group-add
];



  const handlePress = index => {
    const img = sliderImage[index]?.img ?? 'unknown';
    Alert.alert('Image tapped', `Index: ${index}\nURL: ${img}`);
    // or navigation.navigate('Details', { image: img })
  };


  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Icon name="menu" size={responsiveFontSize(3)} color="#000" />
        <Text style={styles.headerTitle}>{name}</Text>
        <Icon name="anchor" size={responsiveFontSize(2.8)} color="#000" />
      </View>

      <ScrollView contentContainerStyle={{marginHorizontal: responsiveWidth(3),}} showsVerticalScrollIndicator={false}>
        {/* Logo Card */}
        <View style={[{paddingTop: responsiveHeight(1.5),overflow: 'hidden'}]}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/2e/02/bf/2e02bf2de46b5cbddf3cfbc16e83e822.jpg' }} // Replace with your image URL:   https://storage.pixteller.com/designs/designs-images/2019-05-15/11/customizable-hospital-banner-ad-1-5cdbd3f3e2c28.png    https://i.pinimg.com/736x/2e/02/bf/2e02bf2de46b5cbddf3cfbc16e83e822.jpg
            style={styles.logo}
            resizeMode='stretch'
          />
        </View>
        {/* <View style={[styles.sliderImage, styles.elevationStyle,{ }]}>
          <ImageSlider
            data={sliderImage}
            autoPlay={true}
            preview={false}
            showIndicator={false}
            onItemPress={handlePress}
            closeIconColor={Colors.background}
            caroselImageContainerStyle={[styles.imageContainerStyle, {height: responsiveWidth(40), width: responsiveWidth(95), backgroundColor: Colors.background, }]}
            caroselImageStyle={[styles.imageStyle, { backgroundColor: 'white', height: responsiveWidth(40), width: '100%', resizeMode: 'stretch', }]}
          />
        </View> */}

        {/* Distance Section */}
        <View style={styles.card}>
          <View style={styles.tabRow}>
            {statsTabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.distanceRow}>
            <Text style={styles.distanceValue}>{currentData.distance}</Text>
            <Text style={styles.distanceDesc}>{currentData.desc}</Text>
            <Icon
              name={currentData.icon}
              size={responsiveFontSize(6)}
              color={currentData.color}
              style={{ alignSelf: 'center' }}
            />
          </View>
        </View>

        {/* My Tasks Section */}
        {/* <View style={styles.card}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <View style={styles.taskRow}>
            <View style={styles.taskCircle}>
              <Text style={styles.taskTotal}>11</Text>
              <Text style={styles.taskLabel}>Total</Text>
            </View>
            <View style={styles.taskLegend}>
              <Text style={styles.legendText}><Text style={{ color: '#0000ff' }}>●</Text> 0 Pending</Text>
              <Text style={styles.legendText}><Text style={{ color: '#ff0000' }}>●</Text> 0 Overdue</Text>
              <Text style={styles.legendText}><Text style={{ color: '#00b300' }}>●</Text> 11 Completed</Text>
            </View>
          </View>
        </View> */}

        {/* Quick Launcher Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Launcher</Text>
          <View style={styles.quickLauncherGrid}>
            {quickLaunchItems.map((item, index) => (
              <TouchableOpacity onPress={()=> navigation.navigate(item.screen)} key={index} style={styles.launcherItem}>
                <View style={styles.iconCircle}>
                  <Icon name={item.icon} size={responsiveFontSize(3)} color="#6366F1" />
                </View>
                <Text style={styles.launcherLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3),
    // marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveHeight(1),
    padding: responsiveWidth(4),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    height: responsiveHeight(20),
    width: '100%',
    alignSelf: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: responsiveHeight(2),
  },
  tabButton: {
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(2),
    backgroundColor: '#f2f2f2',
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    color: '#555',
    fontSize: responsiveFontSize(1.6),
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  distanceRow: {
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    color: '#000',
  },
  distanceDesc: {
    fontSize: responsiveFontSize(1.6),
    color: '#666',
    textAlign: 'center',
    marginVertical: responsiveHeight(1),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    marginBottom: responsiveHeight(1),
    color: '#000',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskCircle: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#00b300',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTotal: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
  },
  taskLabel: {
    fontSize: responsiveFontSize(1.5),
    color: '#555',
  },
  taskLegend: {
    justifyContent: 'space-around',
    height: responsiveHeight(10),
  },
  legendText: {
    fontSize: responsiveFontSize(1.7),
    color: '#555',
  },
  quickLauncherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(1),
  },
  launcherItem: {
    width: '30%',
    alignItems: 'center',
    marginVertical: responsiveHeight(1.5),
  },
  iconCircle: {
    backgroundColor: '#E9EAFE',
    borderRadius: responsiveWidth(6),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  launcherLabel: {
    fontSize: responsiveFontSize(1.5),
    color: '#333',
    textAlign: 'center',
  },

  elevationStyle:{
    shadowColor: Colors.white,
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 2,
      height: 2
    },
    elevation: 3,
    shadowRadius: responsiveFontSize(1)
  },
  sliderImage:{
    borderRadius: responsiveFontSize(1),
    overflow: 'hidden', 
    width: responsiveWidth(90), 
    height: responsiveWidth(40), 
    marginLeft: responsiveWidth(3), 
    marginRight: responsiveWidth(1), 
    marginTop: responsiveWidth(1.5),
    // backgroundColor: 'red',
    // backgroundColor: '#fff',
    // borderRadius: responsiveWidth(3),
    // marginHorizontal: responsiveWidth(3),
    // marginVertical: responsiveHeight(1),
    // padding: responsiveWidth(4),
    // shadowColor: '#000',
    // shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    // elevation: 2,

  },
  imageContainerStyle:{
    height: responsiveWidth(40), width: responsiveWidth(100), backgroundColor: Colors.primary,
    // borderWidth:1,
    // borderColor: Colors.gray
  },
  imageStyle: {
    width: '100%',
    height: responsiveHeight(40),
    resizeMode: 'stretch',
    // overflow:'hidden',
    backgroundColor: 'white', 
  },
});
