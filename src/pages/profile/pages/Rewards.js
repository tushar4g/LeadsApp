import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert,
  Share,
  Platform,
  ToastAndroid,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomButton from '../../../components/CustomButton'
import CustomDropDown from '../../../components/CustomDropDown'
import CustomInput from '../../../components/CustomInput'
import Colors from '../../../style/Colors'

const TABS = [
  { key: 'earned', label: 'Earned Details', icon: 'cash' },
  // { key: 'redeemed', label: 'Redeemed Details', icon: 'ticket-percent' },
  // { key: 'history', label: 'History', icon: 'history' },
]

// API helpers (replace endpoints with real ones)
const getRewardSummary = async () => {
  try {
    // const token = await AsyncStorage.getItem('token')
    // const res = await fetch('https://api.example.com/rewards/summary', { headers: { Authorization: `Bearer ${token}` } })
    // if (!res.ok) throw new Error('Failed')
    // return await res.json()
    // mock
    return { availablePoints: 1250, nextMilestone: 2000, referralCode: 'REF-ITMINGO-123' }
  } catch (e) {
    return { availablePoints: 0, referralCode: '' }
  }
}

const getRewardHistory = async () => {
  try {
    // const token = await AsyncStorage.getItem('token')
    // const res = await fetch('https://api.example.com/rewards/history', { headers: { Authorization: `Bearer ${token}` } })
    // if (!res.ok) throw new Error('Failed')
    // return await res.json()
    // mock
    return [
      { id: '1', type: 'Referral Bonus', desc: 'You earned 500 points for referring Dr. Sharma.', points: 500, date: '2025-10-12', status: 'Approved' },
      { id: '2', type: 'Test Booking', desc: 'You earned 150 points for patient test booking.', points: 150, date: '2025-09-30', status: 'Approved' },
      { id: '3', type: 'Redeem', desc: 'Redeemed for Amazon voucher', points: -300, date: '2025-09-15', status: 'Redeemed' },
    ]
  } catch (e) {
    return []
  }
}

const redeemPointsApi = async (amount) => {
  try {
    // const token = await AsyncStorage.getItem('token')
    // const res = await fetch('https://api.example.com/rewards/redeem', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) })
    // if (!res.ok) throw new Error('Redeem failed')
    // return await res.json()
    // mock success
    return { success: true, redeemedAt: new Date().toISOString() }
  } catch (e) {
    throw e
  }
}

const Badge = ({ status }) => {
  const bg = status === 'Pending' ? Colors.warning : status === 'Redeemed' ? Colors.secondary : Colors.success
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  )
}

const Rewards = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({ availablePoints: 0, referralCode: '' })
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('earned')
  const [redeemModalVisible, setRedeemModalVisible] = useState(false)
  const [redeemAmount, setRedeemAmount] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const [s, h] = await Promise.all([getRewardSummary(), getRewardHistory()])
      if (!mounted) return
      setSummary(s)
      setHistory(h)
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const onRedeem = async () => {
    const amt = parseInt(redeemAmount, 10)
    if (!amt || amt <= 0) {
      Alert.alert('Validation', 'Enter a valid redeem amount.')
      return
    }
    if (amt > summary.availablePoints) {
      Alert.alert('Insufficient Points', 'You do not have enough points to redeem this amount.')
      return
    }
    setRedeeming(true)
    try {
      await redeemPointsApi(amt)
      // update UI locally
      const newHistoryItem = {
        id: Date.now().toString(),
        type: 'Redeem',
        desc: `Redeemed ${amt} points`,
        points: -amt,
        date: new Date().toISOString().slice(0, 10),
        status: 'Redeemed',
      }
      setHistory((p) => [newHistoryItem, ...p])
      setSummary((s) => ({ ...s, availablePoints: s.availablePoints - amt }))
      setRedeemAmount('')
      setRedeemModalVisible(false)
      if (Platform.OS === 'android') {
        ToastAndroid.show('Redeemed successfully', ToastAndroid.SHORT)
      } else {
        Alert.alert('Success', 'Redeemed successfully')
      }
    } catch (e) {
      Alert.alert('Error', e?.message || 'Redeem failed')
    } finally {
      setRedeeming(false)
    }
  }

  const onRefer = async () => {
    try {
      const message = `Join Healthcare CRM and earn rewards! Use my referral code: ${summary.referralCode || 'REF-CODE'}`
      await Share.share({ message })
    } catch (e) {
      Alert.alert('Share', 'Unable to open share dialog.')
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <MaterialCommunityIcons name={item.points >= 0 ? 'plus-circle-outline' : 'minus-circle-outline'} size={22} color={item.points >= 0 ? Colors.success : Colors.secondary} />
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{item.type}</Text>
        <Text style={styles.itemDesc}>{item.desc}</Text>
        <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.pointsText, { color: item.points >= 0 ? Colors.success : Colors.secondary }]}>{item.points > 0 ? `+${item.points}` : item.points}</Text>
        <Badge status={item.status || (item.points >= 0 ? 'Approved' : 'Redeemed')} />
      </View>
    </View>
  )

  const filtered = history.filter((h) => {
    if (activeTab === 'earned') return h.points > 0
    if (activeTab === 'redeemed') return h.points < 0
    return true
  }).filter((h) => (filterType === 'All' ? true : h.type === filterType))

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.back}>
            <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.2)} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.title}>My Rewards</Text>
            <View style={{width: responsiveWidth(10)}} />
        </View>
        <ScrollView contentContainerStyle={styles.container}>

        {loading ? (
            <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        ) : (
            <>
            <View style={styles.summaryCard}>
                <View style={styles.summaryLeft}>
                <MaterialCommunityIcons name="gift" size={responsiveFontSize(4.5)} color={Colors.primary} />
                </View>
                <View style={styles.summaryBody}>
                <Text style={styles.summaryLabel}>Available Points</Text>
                <Text style={styles.summaryPoints}>{summary.availablePoints.toLocaleString()}</Text>
                <Text style={styles.summarySub}>Earn more by referring doctors or patients.</Text>

                <View style={styles.summaryActions}>
                    {/* <CustomButton title="Redeem Now" onPress={() => setRedeemModalVisible(true)} bgColor={Colors.white} color={Colors.primary} borderC={Colors.white} /> */}
                    {/* <CustomButton title="Refer & Earn" onPress={onRefer} bgColor={Colors.primary} color={Colors.white}/> */}
                    <TouchableOpacity onPress={onRefer} style={{backgroundColor: Colors.primary,paddingHorizontal: responsiveWidth(2.5), paddingVertical: responsiveHeight(0.8), alignItems:'center', justifyContent:'center', borderRadius: responsiveWidth(4)}}>
                      <Text style={{color: Colors.white}}>Refer & Earn</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>

            <View style={styles.tabRow}>
                {TABS.map((t) => (
                <TouchableOpacity key={t.key} style={[styles.tabItem, activeTab === t.key && styles.tabItemActive]} onPress={() => setActiveTab(t.key)}>
                    <MaterialCommunityIcons name={t.icon} size={18} color={activeTab === t.key ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.tabLabel, activeTab === t.key && { color: Colors.primary }]}>{t.label}</Text>
                </TouchableOpacity>
                ))}
                <View style={{ flex: 1 }} />
                {/* <View style={{ width: responsiveWidth(20) }}>
                <CustomDropDown value={filterType} setValue={setFilterType} data={[{ label: 'All', value: 'All' }, { label: 'Referral Bonus', value: 'Referral Bonus' }, { label: 'Test Booking', value: 'Test Booking' }]} placeholder="Filter" dropdownPosition="bottom" />
                </View> */}
            </View>

            <View style={styles.section}>
                {filtered.length === 0 ? (
                <View style={styles.empty}>
                    <MaterialCommunityIcons name="emoticon-sad-outline" size={40} color={Colors.textSecondary} />
                    <Text style={styles.emptyText}>No items to show.</Text>
                </View>
                ) : (
                <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={renderItem} scrollEnabled={false} />
                )}
            </View>
            </>
        )}

        {/* Redeem Modal */}
        <Modal visible={redeemModalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Redeem Points</Text>
                <Text style={styles.modalSub}>Available: {summary.availablePoints} pts</Text>

                <CustomInput keyboardType="numeric" label="Amount to redeem" value={redeemAmount} onChangeText={setRedeemAmount} placeholder="Enter points" />

                <View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
                <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
                    <CustomButton title={redeeming ? 'Processing...' : 'Confirm'} onPress={onRedeem} isLoading={redeeming} />
                </View>
                <View style={{ flex: 1 }}>
                    <CustomButton title="Cancel" onPress={() => setRedeemModalVisible(false)} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
                </View>
                </View>
            </View>
            </View>
        </Modal>

        <View style={{ height: responsiveHeight(6) }} />
        </ScrollView>
    </View>
  )
}

export default Rewards

const styles = StyleSheet.create({
  container: { padding: responsiveWidth(4), backgroundColor: Colors.background, minHeight: '100%' },
//   header: { height: responsiveHeight(7), backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: responsiveWidth(3), borderRadius: 6, marginBottom: responsiveHeight(2) },
//   headerLeft: { padding: 6 },
//   headerTitle: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },

  header: {
      height: responsiveHeight(7),
      backgroundColor: Colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveWidth(3),
    },
    back: { width: responsiveWidth(10), justifyContent: 'center' },
    title: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },
  

  loadingWrap: { paddingVertical: responsiveHeight(20), alignItems: 'center' },

  summaryCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(3), marginBottom: responsiveHeight(1.2), elevation: 2 },
  summaryLeft: { width: responsiveWidth(16), alignItems: 'center', justifyContent: 'center' },
  summaryBody: { flex: 1, paddingLeft: responsiveWidth(2) },
  summaryLabel: { color: Colors.primary, fontSize: responsiveFontSize(1.4) },
  summaryPoints: { color: Colors.primary, fontSize: responsiveFontSize(3.2), fontWeight: '700', marginTop: responsiveHeight(0.4) },
  summarySub: { color: Colors.primary, marginTop: responsiveHeight(0.6), fontSize: responsiveFontSize(1.4) },
  summaryActions: { flexDirection: 'row', marginTop: responsiveHeight(1), },

  tabRow: { flexDirection: 'row', alignItems: 'center', marginBottom: responsiveHeight(1), gap: responsiveWidth(2) },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(0.8), paddingHorizontal: responsiveWidth(3), borderRadius: 10, backgroundColor: Colors.white, marginRight: responsiveWidth(1), elevation: 0.5 },
  tabItemActive: { backgroundColor: Colors.lightPrimary, borderWidth: 1, borderColor: Colors.primary },
  tabLabel: { marginLeft: responsiveWidth(1), color: Colors.textSecondary, fontSize: responsiveFontSize(1.6) },

  section: { backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(3), elevation: 1 },

  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(1), borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  itemLeft: { width: responsiveWidth(10), alignItems: 'center' },
  itemBody: { flex: 1, paddingRight: responsiveWidth(2) },
  itemTitle: { fontWeight: '700', color: Colors.textPrimary },
  itemDesc: { color: Colors.textSecondary, marginTop: responsiveHeight(0.3) },
  itemDate: { color: Colors.textTertiary, marginTop: responsiveHeight(0.4), fontSize: responsiveFontSize(0.95) },
  itemRight: { width: responsiveWidth(22), alignItems: 'flex-end' },
  pointsText: { fontWeight: '800', fontSize: responsiveFontSize(1.2) },

  badge: { paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveHeight(0.3), borderRadius: 12, marginTop: responsiveHeight(0.6) },
  badgeText: { color: Colors.white, fontWeight: '700', fontSize: responsiveFontSize(0.9) },

  empty: { alignItems: 'center', paddingVertical: responsiveHeight(6) },
  emptyText: { color: Colors.textSecondary, marginTop: responsiveHeight(1) },

  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox: { marginHorizontal: responsiveWidth(6), backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(4), elevation: 4 },
  modalTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '800', color: Colors.textPrimary },
  modalSub: { color: Colors.textSecondary, marginTop: responsiveHeight(0.6) },
})