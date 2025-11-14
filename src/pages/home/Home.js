import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../style/Colors'

// Placeholder avatar and logo
const AVATAR = 'https://i.pravatar.cc/100?img=12'
// const LOGO = 'https://img.icons8.com/fluency/48/medical-doctor.png' // Healthcare logo https://i.pinimg.com/736x/2e/02/bf/2e02bf2de46b5cbddf3cfbc16e83e822.jpg      https://img.icons8.com/fluency/48/medical-doctor.png
const LOGO = 'https://i.pinimg.com/736x/2e/02/bf/2e02bf2de46b5cbddf3cfbc16e83e822.jpg'

const KPI_CARDS = [
  { key: 'doctors', label: 'Total Doctors', value: 235, icon: 'medical-services', colors: ['#e0f7fa', '#45e0f4ff'] },
  { key: 'leads', label: 'New Leads', value: 32, icon: 'group-add', colors: ['#fff3e0', '#fca829ff'] },
  { key: 'appointments', label: 'Appointments Today', value: 14, icon: 'event-available', colors: ['#e8eaf6', '#485ff6ff'] },
  // { key: 'visits', label: 'Visits Completed', value: 8, icon: 'check-circle', colors: ['#fce4ec', '#f75e94ff'] },
  // { key: 'target', label: 'Target vs Achieved', value: '80%', icon: 'track-changes', colors: ['#e1f5fe', '#51bff2ff'] },
]

const QUICK_ACTIONS = [
  { label: 'Add Doctor', icon: 'medical-services', screen: 'AddDoctor' },
  { label: 'View Doctors', icon: 'people', screen: 'Doctors' },
  { label: 'Add Patient', icon: 'person-add', screen: 'AddPatient' },
  { label: 'Leads', icon: 'link', screen: 'Leads' },
  { label: 'Schedule Visit', icon: 'event', screen: 'Calendar' },
  // { label: 'Tasks', icon: 'check-circle-outline', screen: 'TaskList' },
  // { label: 'Rewards', icon: 'card-giftcard', screen: 'Rewards' },
  { label: 'Geo Tracking', icon: 'my-location', screen: 'Map' },
]

 const quickLaunchItems = [
   { label: 'Add Doctor', icon: 'medical-services', screen: 'AddDoctor' },
  { label: 'View Doctors', icon: 'people', screen: 'Doctors' },
  { label: 'Add Patient', icon: 'person-add', screen: 'AddLead' },
  { label: 'Leads', icon: 'link', screen: 'Leads' },
  { label: 'Schedule Visit', icon: 'event', screen: 'ScheduleVisit' },
  { label: 'Tasks', icon: 'check-circle-outline', screen: 'Task' },
  // { label: 'Rewards', icon: 'card-giftcard', screen: 'Rewards' },
  // { label: 'Geo Tracking', icon: 'my-location', screen: 'Map' },         
];

const ACTIVITY = [
  { time: '10:00 AM', desc: 'Visit Dr. Mehta (Cardiologist)', status: 'pending' },
  { time: '11:30 AM', desc: 'Follow-up: Dr. Sharma', status: 'completed' },
  { time: '01:00 PM', desc: 'Call Patient: Mr. Singh', status: 'missed' },
  { time: '03:00 PM', desc: 'Visit Dr. Patel (Dermatologist)', status: 'pending' },
]

const INSIGHTS = [
  { icon: 'notifications-active', text: 'You have 3 pending follow-ups today.' },
  { icon: 'event-note', text: '2 Appointments scheduled for tomorrow.' },
  { icon: 'warning', text: '1 Task is overdue.' },
]

// Placeholder chart images
const CHART_IMG = 'https://img.icons8.com/fluency/48/combo-chart.png'

const Home = ({ navigation, userRole = 'Manager' }) => {
  // Example: userRole could be 'Admin', 'Manager', 'Field Executive'
  const [kpiCards, setKpiCards] = useState(KPI_CARDS)
  const [selectedTab, setSelectedTab] = useState('Yesterday');

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

  // Handler for quick actions
  const handleQuickAction = (screen) => {
    if (navigation && screen) navigation.navigate(screen)
  }

  // Status icon for activity timeline
  const getStatusIcon = (status) => {
    if (status === 'completed') return <MaterialIcons name="check-circle" color="#22c55e" size={22} />
    if (status === 'pending') return <MaterialIcons name="schedule" color="#f59e42" size={22} />
    if (status === 'missed') return <MaterialIcons name="cancel" color="#ef4444" size={22} />
    return null
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header / App Bar */}
      <View style={styles.headerBar}>
        {/* <Image source={{ uri: LOGO }} resizeMode='stretch' style={styles.logo} /> */}
        <Text style={styles.appTitle}>Healthcare CRM</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Notification')}>
            <MaterialIcons name="notifications-none" size={responsiveFontSize(3)} color={Colors.white || '#4e8cff'} style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Profile')}>
            {AVATAR ? 
            <Image source={{ uri: AVATAR }} resizeMode='contain' style={styles.avatar} />
            :
            <MaterialCommunityIcons name="account-circle" size={responsiveFontSize(3)} color={Colors.white || '#4e8cff'}  />
            }
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{marginHorizontal: responsiveWidth(4),}}>
        {/* Greeting */}
        {/* <Text style={styles.greeting}>Good Morning, Dr. Tushar 👋</Text> */}
        
        {/* Dashboard Summary Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiScroll}>
          {kpiCards.map((card) => (
            <View key={card.key} style={[styles.kpiCard, { backgroundColor: card.colors[0] }]}>
              <View style={styles.kpiIconWrap}>
                <MaterialIcons name={card.icon} size={responsiveFontSize(3)} color={card.colors[1]} />
              </View>
              <Text style={styles.kpiValue}>{card.value}</Text>
              <Text style={styles.kpiLabel}>{card.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Distance Section */}
        <View style={[styles.card, {}]}>
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
            <MaterialIcons
              name={currentData.icon}
              size={responsiveFontSize(6)}
              color={currentData.color}
              style={{ alignSelf: 'center' }}
            />
          </View>
        </View>

        {/* Quick Actions */}
        {/* <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={() => handleQuickAction(action.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.quickIconWrap}>
                <MaterialIcons name={action.icon} size={responsiveFontSize(3)} color={Colors.primary || '#4e8cff'} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Quick Launcher Section */}
        {/* <Text style={styles.sectionTitle}>Quick Actions</Text> */}
        <View style={[styles.card, {marginHorizontal: responsiveWidth(0),}]}>
          <Text style={styles.sectionTitle}>Quick Launcher</Text>
          <View style={styles.quickLauncherGrid}>
            {quickLaunchItems.map((item, index) => (
              <TouchableOpacity onPress={()=> navigation.navigate(item.screen)} key={index} style={styles.launcherItem}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name={item.icon} size={responsiveFontSize(3)} color="#6366F1" />
                </View>
                <Text style={styles.launcherLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Overview / Activity Timeline */}
        {/* <Text style={styles.sectionTitle}>Today’s Overview</Text>
        <View style={styles.timelineCard}>
          {ACTIVITY.map((item, idx) => (
            <View key={idx} style={styles.timelineRow}>
              <Text style={styles.timelineTime}>{item.time}</Text>
              <Text style={styles.timelineDesc}>{item.desc}</Text>
              {getStatusIcon(item.status)}
            </View>
          ))}
        </View> */}

        {/* Lead & Sales Funnel Snapshot */}
        {/* <Text style={styles.sectionTitle}>Lead & Sales Funnel</Text>
        <View style={styles.chartsRow}>
          <View style={styles.chartCard}>
            <Image source={{ uri: CHART_IMG }} style={styles.chartImg} />
            <Text style={styles.chartLabel}>Leads by Stage</Text>
          </View>
          <View style={styles.chartCard}>
            <Image source={{ uri: CHART_IMG }} style={styles.chartImg} />
            <Text style={styles.chartLabel}>Top Specializations</Text>
          </View>
          <View style={styles.chartCard}>
            <Image source={{ uri: CHART_IMG }} style={styles.chartImg} />
            <Text style={styles.chartLabel}>Target vs Achievement</Text>
          </View>
        </View> */}

        {/* Insights / Alerts / Notifications */}
        <View style={[styles.card, {marginHorizontal: responsiveWidth(0),}]}>
        <Text style={styles.sectionTitle}>Insights & Alerts</Text>
        <View style={styles.insightsCard}>
          {INSIGHTS.map((item, idx) => (
            <View key={idx} style={styles.insightRow}>
              <MaterialIcons name={item.icon} size={responsiveFontSize(2)} color={Colors.secondary || '#ff5252'} style={{ marginRight: 8 }} />
              <Text style={styles.insightText}>{item.text}</Text>
            </View>
          ))}
        </View>
        </View>

        {/* Map / Geo Coverage (Optional) */}
        {userRole === 'Field Executive' && (
          <>
            <Text style={styles.sectionTitle}>Geo Coverage</Text>
            <View style={styles.mapCard}>
              <MaterialIcons name="my-location" size={40} color={Colors.primary || '#4e8cff'} />
              <Text style={styles.mapText}>Visited 12 locations today</Text>
              <TouchableOpacity style={styles.mapBtn}>
                <Text style={styles.mapBtnText}>Open Full Map View</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Footer / Bottom Navigation Tabs */}
        {/* <View style={styles.footerTabs}>
          <FooterTab icon="home" label="Home" active />
          <FooterTab icon="people" label="Doctors" />
          <FooterTab icon="link" label="Leads" />
          <FooterTab icon="event" label="Schedule" />
          <FooterTab icon="person" label="Profile" />
        </View> */}
      </ScrollView>
    </View>
  )
}

// Footer Tab Component
const FooterTab = ({ icon, label, active }) => (
  <View style={[styles.tabItem, active && styles.tabActive]}>
    <MaterialIcons name={icon} size={22} color={active ? Colors.primary || '#4e8cff' : '#888'} />
    <Text style={[styles.tabLabel, active && { color: Colors.primary || '#4e8cff' }]}>{label}</Text>
  </View>
)

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
    backgroundColor: Colors.primary || '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: responsiveHeight(7),
  },
  logo: { width: responsiveWidth(8), height: responsiveWidth(8), marginRight: responsiveWidth(2), borderRadius: responsiveWidth(4)},
  logo1: {
    height: responsiveHeight(20),
    width: '100%',
    alignSelf: 'center',
  },
  appTitle: { fontSize: responsiveFontSize(2.2), fontWeight: 'bold', color: Colors.white || '#4e8cff', flex: 1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: responsiveWidth(7), height: responsiveWidth(7), borderRadius: responsiveWidth(5), borderWidth: 1, borderColor: '#eee' },
  greeting: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: Colors.black || '#4e8cff',
    marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
  },
  kpiScroll: { marginVertical: responsiveHeight(1), padding: responsiveWidth(0.4)},
  kpiCard: {
    width: responsiveWidth(28),
    marginRight: responsiveWidth(3),
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  kpiIconWrap: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(6),
    padding: responsiveWidth(2),
    marginBottom: responsiveHeight(0.5),
    elevation: 1,
  },
  kpiValue: { fontSize: responsiveFontSize(2.5), fontWeight: 'bold', color: '#222' },
  kpiLabel: { fontSize: responsiveFontSize(1.5), color: '#333', marginTop: 2, textAlign: 'center' },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.black || '#4e8cff',
    marginLeft: responsiveWidth(4),
    // marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1),
    letterSpacing: 0.5,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: responsiveWidth(4),
    gap: responsiveWidth(4),
  },
  quickAction: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: responsiveHeight(2),
    padding: responsiveWidth(0.8),
    elevation: 1,
  },
  quickIconWrap: {
    backgroundColor: Colors.lightPrimary,
    borderRadius: responsiveWidth(6),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(0.5),
  },
  quickLabel: {
    fontSize: responsiveFontSize(1.3),
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    marginHorizontal: responsiveWidth(4),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    elevation: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 6,
  },
  timelineTime: { width: 80, color: '#555', fontWeight: '600' },
  timelineDesc: { flex: 1, color: '#222', fontSize: responsiveFontSize(1.7) },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
  },
  chartCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 10,
    elevation: 1,
  },
  chartImg: { width: 38, height: 38, marginBottom: 6 },
  chartLabel: { fontSize: responsiveFontSize(1.2), color: '#333', textAlign: 'center' },
  insightsCard: {
    // backgroundColor: '#fff',
    // borderRadius: responsiveWidth(4),
    // marginHorizontal: responsiveWidth(4),
    padding: responsiveWidth(3),
    // marginBottom: responsiveHeight(2),
    // elevation: 1,
  },
  insightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: responsiveHeight(1) },
  insightText: { color: '#222', fontSize: responsiveFontSize(1.5) },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    marginHorizontal: responsiveWidth(4),
    padding: responsiveWidth(3),
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    elevation: 1,
  },
  mapText: { fontSize: responsiveFontSize(1.7), color: '#333', marginVertical: responsiveHeight(1) },
  mapBtn: {
    backgroundColor: Colors.primary || '#4e8cff',
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(1),
  },
  mapBtnText: { color: '#fff', fontWeight: 'bold' },
  footerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 6,
    marginTop: responsiveHeight(2),
  },
  tabItem: { alignItems: 'center', flex: 1 },
  tabActive: {},
  tabLabel: { fontSize: responsiveFontSize(1.2), color: '#888', marginTop: 2 },

   card: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3),
    // marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveHeight(1),
    padding: responsiveWidth(2),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
})

export default Home