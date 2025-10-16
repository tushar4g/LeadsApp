import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import Colors from '../../style/Colors'

// Placeholder avatar and logo
const AVATAR = 'https://i.pravatar.cc/100?img=12'
const LOGO = 'https://img.icons8.com/fluency/48/medical-doctor.png'

const KPI_CARDS = [
  { key: 'doctors', label: 'Total Doctors', value: 235, icon: 'medical-services', colors: ['#e0f7fa', '#45e0f4ff'] },
  { key: 'leads', label: 'New Leads', value: 32, icon: 'group-add', colors: ['#fff3e0', '#fca829ff'] },
  { key: 'appointments', label: 'Appointments Today', value: 14, icon: 'event-available', colors: ['#e8eaf6', '#485ff6ff'] },
  { key: 'visits', label: 'Visits Completed', value: 8, icon: 'check-circle', colors: ['#fce4ec', '#f75e94ff'] },
  // { key: 'target', label: 'Target vs Achieved', value: '80%', icon: 'track-changes', colors: ['#e1f5fe', '#51bff2ff'] },
]

const QUICK_ACTIONS = [
  { label: 'Add Doctor', icon: 'medical-services', screen: 'AddDoctor' },
  { label: 'View Doctors', icon: 'people', screen: 'ViewDoctors' },
  { label: 'Add Patient', icon: 'person-add', screen: 'AddPatient' },
  { label: 'Leads', icon: 'link', screen: 'Leads' },
  { label: 'Schedule Visit', icon: 'event', screen: 'Calendar' },
  // { label: 'Tasks', icon: 'check-circle-outline', screen: 'TaskList' },
  // { label: 'Rewards', icon: 'card-giftcard', screen: 'Rewards' },
  { label: 'Geo Tracking', icon: 'my-location', screen: 'Map' },
]

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

const Home = ({ navigation, userRole = 'Field Executive' }) => {
  // Example: userRole could be 'Admin', 'Manager', 'Field Executive'
  const [kpiCards, setKpiCards] = useState(KPI_CARDS)

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
        <Image source={{ uri: LOGO }} style={styles.logo} />
        <Text style={styles.appTitle}>Healthcare CRM</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Notifications')}>
            <MaterialIcons name="notifications-none" size={26} color={Colors.primary || '#4e8cff'} style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Profile')}>
            <Image source={{ uri: AVATAR }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {/* Greeting */}
        <Text style={styles.greeting}>Good Morning, Dr. Tushar 👋</Text>

        {/* Dashboard Summary Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiScroll}>
          {kpiCards.map((card) => (
            <View key={card.key} style={[styles.kpiCard, { backgroundColor: card.colors[0] }]}>
              <View style={styles.kpiIconWrap}>
                <MaterialIcons name={card.icon} size={32} color={card.colors[1]} />
              </View>
              <Text style={styles.kpiValue}>{card.value}</Text>
              <Text style={styles.kpiLabel}>{card.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
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
        <Text style={styles.sectionTitle}>Insights & Alerts</Text>
        <View style={styles.insightsCard}>
          {INSIGHTS.map((item, idx) => (
            <View key={idx} style={styles.insightRow}>
              <MaterialIcons name={item.icon} size={20} color={Colors.secondary || '#ff5252'} style={{ marginRight: 8 }} />
              <Text style={styles.insightText}>{item.text}</Text>
            </View>
          ))}
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
    backgroundColor: Colors.white || '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: { width: 36, height: 36, marginRight: 10 },
  appTitle: { fontSize: responsiveFontSize(2.2), fontWeight: 'bold', color: Colors.black || '#4e8cff', flex: 1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#eee' },
  greeting: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: Colors.black || '#4e8cff',
    marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
  },
  kpiScroll: { paddingLeft: responsiveWidth(4), marginBottom: responsiveHeight(2) },
  kpiCard: {
    width: responsiveWidth(38),
    marginRight: responsiveWidth(3),
    borderRadius: 16,
    padding: responsiveWidth(4),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  kpiIconWrap: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    marginBottom: 6,
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
    borderRadius: 14,
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
    borderRadius: 14,
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
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: responsiveWidth(4),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    elevation: 1,
  },
  insightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  insightText: { color: '#222', fontSize: responsiveFontSize(1.5) },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: responsiveWidth(4),
    padding: responsiveWidth(3),
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    elevation: 1,
  },
  mapText: { fontSize: responsiveFontSize(1.7), color: '#333', marginVertical: 8 },
  mapBtn: {
    backgroundColor: Colors.primary || '#4e8cff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginTop: 6,
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
})

export default Home