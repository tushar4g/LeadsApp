// ...existing code...
import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Platform,
} from 'react-native'
import { Calendar } from 'react-native-calendars'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import Colors from '../../style/Colors'
import CustomButton from '../../components/CustomButton'
import CustomDropDown from '../../components/CustomDropDown'
import CustomInput from '../../components/CustomInput'
import CustomDateTimePicker from '../../components/CustomDateTimePicker'

/**
 * ScheduleVisit screen
 * - Calendar at top (react-native-calendars)
 * - Visit list for selected date
 * - Add Visit modal / form
 * - Mocked API calls (getVisits, createVisit, updateVisitStatus, getCalendarSummary)
 */

const VISIT_TYPES = [
  { label: 'Call', value: 'Call' },
  { label: 'Meeting', value: 'Meeting' },
  { label: 'Follow-up', value: 'Follow-up' },
]

const STATUS_COLORS = {
  Planned: '#2B7CE9', // blue
  Completed: Colors.success || '#28a745',
  Cancelled: Colors.secondary || '#dc3545',
  Overdue: '#FF8C00',
}

/* --- Mocked data & API (replace with real API hooks) --- */
const mockVisits = [
  {
    id: 'v-1',
    personName: 'Dr. Anil Mehta',
    visitType: 'Follow-up',
    datetime: '2025-11-10T10:30:00.000Z',
    status: 'Planned',
    location: 'City Heart Clinic, Raipur',
    city: 'Raipur',
    assignedTo: 'Field Exec 1',
    notes: 'Bring ECG report',
    latitude: 21.2514,
    longitude: 81.6296,
  },
  {
    id: 'v-2',
    personName: 'Ms. Rekha Singh',
    visitType: 'Call',
    datetime: new Date().toISOString(),
    status: 'Planned',
    location: 'Remote',
    city: 'Raipur',
    assignedTo: 'Admin',
    notes: 'Intro call',
    latitude: null,
    longitude: null,
  },
  {
    id: 'v-3',
    personName: 'Dr. Rajiv Patel',
    visitType: 'Meeting',
    datetime: '2025-11-12T15:00:00.000Z',
    status: 'Completed',
    location: 'Neuro Health, Durg',
    city: 'Durg',
    assignedTo: 'Field Exec 2',
    notes: '',
    latitude: 21.1910,
    longitude: 81.2844,
  },
]

const fakeApi = {
  getCalendarSummary: async () => {
    // returns an object keyed by date with counts or dots
    return new Promise((res) =>
      setTimeout(() => {
        const summary = {}
        mockVisits.forEach((v) => {
          const d = v.datetime ? v.datetime.split('T')[0] : new Date().toISOString().split('T')[0]
          summary[d] = summary[d] || { marked: true, dots: [] }
          summary[d].dots.push({ color: STATUS_COLORS[v.status] || STATUS_COLORS.Planned })
        })
        res(summary)
      }, 300)
    )
  },
  getVisits: async (date) => {
    return new Promise((res) =>
      setTimeout(() => {
        const list = mockVisits.filter((v) => v.datetime?.split('T')[0] === date)
        res(list)
      }, 300)
    )
  },
  createVisit: async (payload) => {
    return new Promise((res) =>
      setTimeout(() => {
        const created = { ...payload, id: `v-${Date.now()}` }
        mockVisits.push(created)
        res(created)
      }, 400)
    )
  },
  updateVisitStatus: async (id, status) => {
    return new Promise((res) =>
      setTimeout(() => {
        const idx = mockVisits.findIndex((m) => m.id === id)
        if (idx >= 0) mockVisits[idx].status = status
        res(true)
      }, 300)
    )
  },
}

/* --- Component --- */
const ScheduleVisit = ({ navigation }) => {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [markedDates, setMarkedDates] = useState({})
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(false)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [form, setForm] = useState({
    visitType: 'Call',
    personName: '',
    datetime: new Date().toISOString(),
    location: '',
    city: '',
    notes: '',
    assignedTo: '',
    status: 'Planned',
    latitude: null,
    longitude: null,
  })

  useEffect(() => {
    refreshCalendar()
    loadVisitsForDate(selectedDate)
  }, [])

  useEffect(() => {
    loadVisitsForDate(selectedDate)
  }, [selectedDate])

  const refreshCalendar = async () => {
    setLoading(true)
    const summary = await fakeApi.getCalendarSummary()
    // build markedDates structure for react-native-calendars
    const md = {}
    Object.keys(summary).forEach((d) => {
      md[d] = { marked: true, dots: summary[d].dots }
    })
    // ensure selected date is highlighted
    md[selectedDate] = { ...(md[selectedDate] || {}), selected: true, selectedColor: Colors.primary }
    setMarkedDates(md)
    setLoading(false)
  }

  const loadVisitsForDate = async (date) => {
    setLoading(true)
    const list = await fakeApi.getVisits(date)
    setVisits(list)
    // ensure calendar shows selected
    setMarkedDates((prev) => ({ ...prev, [date]: { ...(prev[date] || {}), selected: true, selectedColor: Colors.primary } }))
    setLoading(false)
  }

  const onGoToToday = () => {
    const t = new Date().toISOString().split('T')[0]
    setSelectedDate(t)
    loadVisitsForDate(t)
  }

  const openMap = (item) => {
    if (item.latitude != null && item.longitude != null) {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open map.'))
    } else if (item.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open map.'))
    } else {
      Alert.alert('Location not available')
    }
  }

  const onMarkCompleted = async (id) => {
    await fakeApi.updateVisitStatus(id, 'Completed')
    Alert.alert('Updated', 'Visit marked as completed.')
    refreshCalendar()
    loadVisitsForDate(selectedDate)
  }

  const onCancelVisit = async (id) => {
    Alert.alert('Cancel Visit', 'Are you sure you want to cancel this visit?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await fakeApi.updateVisitStatus(id, 'Cancelled')
          refreshCalendar()
          loadVisitsForDate(selectedDate)
        },
      },
    ])
  }

  const onSaveVisit = async () => {
    if (!form.personName || !form.datetime) {
      Alert.alert('Validation', 'Please enter a person/lead and date/time.')
      return
    }
    const payload = { ...form }
    // ensure datetime is ISO date-time string
    if (typeof payload.datetime === 'object' && payload.datetime.toISOString) payload.datetime = payload.datetime.toISOString()
    await fakeApi.createVisit(payload)
    setAddModalVisible(false)
    setForm({
      visitType: 'Call',
      personName: '',
      datetime: new Date().toISOString(),
      location: '',
      city: '',
      notes: '',
      assignedTo: '',
      status: 'Planned',
      latitude: null,
      longitude: null,
    })
    Alert.alert('Success', 'Visit scheduled successfully.')
    refreshCalendar()
    loadVisitsForDate(selectedDate)
  }

  const renderVisit = ({ item }) => {
    const color = STATUS_COLORS[item.status] || STATUS_COLORS.Planned
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.personName}>{item.personName}</Text>
          <View style={[styles.statusChip, { backgroundColor: color }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.meta}>{item.visitType} • {new Date(item.datetime).toLocaleString()}</Text>
        <Text style={styles.meta}>{item.location} {item.city ? `• ${item.city}` : ''}</Text>
        {item.assignedTo ? <Text style={styles.metaSmall}>Assigned to: {item.assignedTo}</Text> : null}
        {item.notes ? <Text style={styles.notes}>Notes: {item.notes}</Text> : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onMarkCompleted(item.id)}>
            <MaterialIcons name="check-circle" size={20} color={Colors.success} />
            <Text style={styles.actionLabel}>Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {
            // open edit modal prefilled
            setForm({
              visitType: item.visitType,
              personName: item.personName,
              datetime: item.datetime,
              location: item.location,
              city: item.city,
              notes: item.notes,
              assignedTo: item.assignedTo,
              status: item.status,
              id: item.id,
            })
            setAddModalVisible(true)
          }}>
            <MaterialIcons name="edit" size={20} color={Colors.info} />
            <Text style={styles.actionLabel}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => onCancelVisit(item.id)}>
            <MaterialIcons name="cancel" size={20} color={Colors.secondary} />
            <Text style={styles.actionLabel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => openMap(item)}>
            <MaterialIcons name="map" size={20} color={Colors.primary} />
            <Text style={styles.actionLabel}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const visitsList = useMemo(() => visits, [visits])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
            onPress={() => navigation && navigation.goBack()}
            // style={{padding: responsiveWidth(1)}}
        >
            <MaterialCommunityIcons
            name="arrow-left"
            size={responsiveFontSize(2.5)}
            color={Colors.white}
            />
        </TouchableOpacity>
        <Text style={styles.title}>Schedule Visit</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => Alert.alert('Search', 'Search not implemented')} style={styles.iconBtn}>
            <MaterialIcons name="search" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Filter', 'Filter not implemented')} style={styles.iconBtn}>
            <MaterialIcons name="filter-list" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: responsiveHeight(18) }}>
        {/* Calendar */}
        <View style={styles.calendarBox}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              setSelectedDate(day.dateString)
              loadVisitsForDate(day.dateString)
            }}
            markedDates={{
                [selectedDate]: { selected: true, selectedColor: Colors.primary },
            //   ...markedDates,
            //   [selectedDate]: { ...(markedDates[selectedDate] || {}), selected: true, selectedColor: Colors.primary },
            }}
            markingType={'multi-dot'}
            theme={{
              selectedDayBackgroundColor: Colors.primary,
              todayTextColor: Colors.primary,
              arrowColor: Colors.primary,
              monthTextColor: Colors.textPrimary,
            }}
          />
          <View style={styles.calendarActions}>
            <CustomButton title="Go to Today" onPress={onGoToToday} />
            <View style={{ width: responsiveWidth(2) }} />
            <CustomButton title="Add Visit" onPress={() => {
              setForm((s) => ({ ...s, datetime: `${selectedDate}T09:00:00.000Z` }))
              setAddModalVisible(true)
            }} bgColor={Colors.primary} color={Colors.white} />
          </View>
        </View>

        {/* Visits List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visits on {selectedDate}</Text>

          {loading ? (
            <Text style={{ color: Colors.textSecondary, padding: responsiveHeight(2) }}>Loading...</Text>
          ) : visitsList.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ color: Colors.textSecondary }}>No visits scheduled for this date. Tap ➕ to add one.</Text>
            </View>
          ) : (
            <FlatList data={visitsList} keyExtractor={(i) => i.id} renderItem={renderVisit} scrollEnabled={false} />
          )}
        </View>
      </ScrollView>

      {/* Add Visit Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{form.id ? 'Edit Visit' : 'Add Visit'}</Text>

              <CustomDropDown title="Visit Type" value={form.visitType} setValue={(v) => setForm((s) => ({ ...s, visitType: v }))} data={VISIT_TYPES} placeholder="Select type" />
              <CustomInput label="Doctor / Lead" value={form.personName} onChangeText={(t) => setForm((s) => ({ ...s, personName: t }))} placeholder="Name" />
              <CustomDateTimePicker label="Date & Time" value={form.datetime} onChange={(dt) => setForm((s) => ({ ...s, datetime: dt }))} />
              <CustomInput label="Location" value={form.location} onChangeText={(t) => setForm((s) => ({ ...s, location: t }))} placeholder="Clinic / Address" />
              <CustomInput label="City" value={form.city} onChangeText={(t) => setForm((s) => ({ ...s, city: t }))} placeholder="City" />
              <CustomInput label="Notes" multiline value={form.notes} onChangeText={(t) => setForm((s) => ({ ...s, notes: t }))} placeholder="Notes / Remarks" />
              <CustomInput label="Assigned To" value={form.assignedTo} onChangeText={(t) => setForm((s) => ({ ...s, assignedTo: t }))} placeholder="Assigned user" />

              <View style={{ flexDirection: 'row', marginTop: responsiveHeight(1), marginBottom: responsiveHeight(1) }}>
                <View style={{ flex: 1 }}>
                  <CustomButton title="Save" onPress={onSaveVisit} />
                </View>
                <View style={{ width: responsiveWidth(2) }} />
                <View style={{ flex: 1 }}>
                  <CustomButton title="Cancel" onPress={() => setAddModalVisible(false)} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => {navigation && navigation.navigate('AddVisit')}}>
        <MaterialCommunityIcons name="calendar-plus" size={26} color={Colors.white} />
      </TouchableOpacity>
    </View>
  )
}

export default ScheduleVisit
// ...existing code...

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
    elevation: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },

  headerActions: { flexDirection: 'row', gap: responsiveWidth(0), },
  iconBtn: { padding: responsiveWidth(1) },

  calendarBox: { padding: responsiveWidth(3), backgroundColor: Colors.white, margin: responsiveWidth(3), borderRadius: 12, elevation: 2 },
  calendarActions: { flexDirection: 'row', marginTop: responsiveHeight(1), justifyContent: 'flex-end' },

  section: { marginHorizontal: responsiveWidth(3), marginTop: responsiveHeight(1) },
  sectionTitle: { fontSize: responsiveFontSize(1.2), fontWeight: '800', color: Colors.textPrimary, marginBottom: responsiveHeight(1) },

  card: { backgroundColor: Colors.white, padding: responsiveWidth(3), borderRadius: 12, marginBottom: responsiveHeight(1.2), elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  personName: { fontWeight: '800', fontSize: responsiveFontSize(1.2), color: Colors.textPrimary },
  statusChip: { paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveHeight(0.3), borderRadius: 12 },
  statusText: { color: Colors.white, fontWeight: '700' },
  meta: { color: Colors.textSecondary, marginTop: responsiveHeight(0.5) },
  metaSmall: { color: Colors.textSecondary, marginTop: responsiveHeight(0.3), fontSize: responsiveFontSize(0.95) },
  notes: { color: Colors.textPrimary, marginTop: responsiveHeight(0.6) },

  actionsRow: { flexDirection: 'row', marginTop: responsiveHeight(1), justifyContent: 'space-between' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(1) },
  actionLabel: { marginLeft: responsiveWidth(0.6), color: Colors.textSecondary },

  empty: { padding: responsiveHeight(4), alignItems: 'center' },

  fab: { position: 'absolute', right: responsiveWidth(5), bottom: responsiveHeight(4), backgroundColor: Colors.primary, width: responsiveWidth(14), height: responsiveWidth(14), borderRadius: responsiveWidth(7), alignItems: 'center', justifyContent: 'center', elevation: 6 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center' },
  modalBox: { marginHorizontal: responsiveWidth(4), backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(4), maxHeight: '85%' },
  modalTitle: { fontSize: responsiveFontSize(1.4), fontWeight: '800', color: Colors.textPrimary, marginBottom: responsiveHeight(1) },
})