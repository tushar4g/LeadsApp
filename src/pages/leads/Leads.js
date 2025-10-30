// ...existing code...
import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Searchbar } from 'react-native-paper'
import CustomButton from '../../components/CustomButton'
import CustomDropDown from '../../components/CustomDropDown'
import Colors from '../../style/Colors'

const SUMMARY = [
  { key: 'new', label: 'New Leads', count: 24, icon: 'note-plus-outline', color: Colors.lightPrimary },
  { key: 'followup', label: 'Follow-up', count: 12, icon: 'repeat', color: Colors.card2 },
  { key: 'converted', label: 'Converted', count: 8, icon: 'check-circle-outline', color: Colors.card3 },
  { key: 'lost', label: 'Lost', count: 3, icon: 'close-circle-outline', color: Colors.card4 },
]

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'New', value: 'New' },
  { label: 'Follow-up', value: 'Follow-up' },
  { label: 'Converted', value: 'Converted' },
  { label: 'Lost', value: 'Lost' },
]

const SOURCE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Event', value: 'Event' },
  { label: 'Online', value: 'Online' },
]

const CITY_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Raipur', value: 'Raipur' },
  { label: 'Bilaspur', value: 'Bilaspur' },
  { label: 'Durg', value: 'Durg' },
]

const mockLeads = [
  {
    id: 'l1',
    name: 'Dr. Rohan Mehta',
    source: 'Hospital: Apollo Delhi',
    contact: '9876543210',
    status: 'Follow-up',
    score: 85,
    createdAt: '12 Oct 2025',
    city: 'Raipur',
    assignedTo: 'Tushar',
  },
  {
    id: 'l2',
    name: 'Ms. Priya Singh',
    source: 'Corporate: HealthCorp',
    contact: '9123456780',
    status: 'New',
    score: 70,
    createdAt: '15 Oct 2025',
    city: 'Bilaspur',
    assignedTo: 'Amit',
  },
  {
    id: 'l3',
    name: 'Dr. Neha Sharma',
    source: 'Event: MedExpo',
    contact: '9987654321',
    status: 'Converted',
    score: 92,
    createdAt: '01 Oct 2025',
    city: 'Durg',
    assignedTo: 'Kiran',
  },
  // ...add more mock items if needed
]

const statusColor = (status) => {
  switch (status) {
    case 'Converted':
      return Colors.success
    case 'Follow-up':
      return Colors.warning
    case 'Lost':
      return Colors.secondary
    default:
      return Colors.primary
  }
}

const Leads = ({ navigation }) => {
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [leadList, setLeadList] = useState(mockLeads)
  const [refreshing, setRefreshing] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    // simulate fetch
    setTimeout(() => {
      setLeadList(mockLeads)
      setRefreshing(false)
    }, 800)
  }

  const applySummaryFilter = (key) => {
    if (key === 'new') setFilterStatus('New')
    else if (key === 'followup') setFilterStatus('Follow-up')
    else if (key === 'converted') setFilterStatus('Converted')
    else if (key === 'lost') setFilterStatus('Lost')
  }

  const clearAllFilters = () => {
    setSearchText('')
    setFilterStatus('')
    setFilterSource('')
    setFilterCity('')
  }

  const filteredLeads = useMemo(() => {
    let list = [...leadList]
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q) ||
          (l.contact && l.contact.includes(q))
      )
    }
    if (filterStatus) list = list.filter((l) => l.status === filterStatus)
    if (filterSource) list = list.filter((l) => l.source.toLowerCase().includes(filterSource.toLowerCase()))
    if (filterCity) list = list.filter((l) => l.city === filterCity)
    return list
  }, [leadList, searchText, filterStatus, filterSource, filterCity])

  const handleDelete = (id) => {
    setLeadList((prev) => prev.filter((p) => p.id !== id))
  }

  const renderSummaryCard = ({ item }) => (
    <TouchableOpacity style={[styles.summaryCard, { backgroundColor: item.color }]} onPress={() => applySummaryFilter(item.key)}>
      <MaterialCommunityIcons name={item.icon} size={22} color={Colors.textPrimary} />
      <Text style={styles.summaryCount}>{item.count}</Text>
      <Text style={styles.summaryLabel}>{item.label}</Text>
    </TouchableOpacity>
  )

  const renderLead = ({ item }) => (
    <View style={styles.leadCard}>
      <View style={styles.leadRow}>
        <Text style={styles.leadName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.leadSource}>{item.source}</Text>

      <View style={styles.leadMetaRow}>
        <Text style={styles.leadMeta}>📞 {item.contact}</Text>
        <Text style={styles.leadMeta}>⭐ {item.score}%</Text>
      </View>

      <View style={styles.leadMetaRow}>
        <Text style={styles.leadMeta}>🗓️ {item.createdAt}</Text>
        <Text style={styles.leadMetaSmall}>Assigned: {item.assignedTo || '—'}</Text>
      </View>

      <View style={styles.leadActions}>
        <TouchableOpacity onPress={() => navigation && navigation.navigate('LeadDetails', { lead: item })} style={styles.actionBtn}>
          <MaterialCommunityIcons name="eye-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionLabel}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation && navigation.navigate('EditLead', { lead: item })} style={styles.actionBtn}>
          <MaterialCommunityIcons name="pencil" size={18} color={Colors.primary} />
          <Text style={styles.actionLabel}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
          <MaterialCommunityIcons name="delete-outline" size={18} color={Colors.secondary} />
          <Text style={[styles.actionLabel, { color: Colors.secondary }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{color: Colors.white, fontSize: responsiveFontSize(2.2), fontWeight: '700'}}>Leads</Text>
        <View style={{flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => {}} style={[{padding: responsiveWidth(2)}]}>
            <MaterialCommunityIcons name="magnify" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={[{ marginLeft: responsiveWidth(1), padding: responsiveWidth(2) }]}>
            <MaterialCommunityIcons name="filter-variant" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Summary Cards */}
            <View style={styles.summaryWrap}>
              {SUMMARY.map((s) => (
                <View key={s.key} style={styles.summaryCol}>
                  {renderSummaryCard({ item: s })}
                </View>
              ))}
            </View>

            {/* Searchbar & quick filter indicators */}
            <View style={styles.searchWrap}>
              <View style={{ flex: 1,  }}>
                <Searchbar
                  placeholder="Search leads by name, source, or contact…"
                  onChangeText={setSearchText}
                  value={searchText}
                  style={styles.searchbar}
                  inputStyle={styles.searchInput}
                  icon={() => <MaterialCommunityIcons name="magnify" size={responsiveFontSize(2.2)} color={Colors.textSecondary} />}
                />
              </View>
              <TouchableOpacity style={styles.filterShortBtn} onPress={() => setFilterModalVisible(true)}>
                <MaterialCommunityIcons name="filter" size={responsiveFontSize(2.2)} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Active filters summary */}
            <View style={styles.activeFiltersRow}>
              <Text style={styles.activeText}>{filterStatus ? `Status: ${filterStatus}` : ''} {filterSource ? ` • Source: ${filterSource}` : ''} {filterCity ? ` • City: ${filterCity}` : ''}</Text>
              <TouchableOpacity onPress={clearAllFilters}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>All Leads</Text>
          </>
        }
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="database-remove" size={48} color={Colors.gray} />
            <Text style={styles.emptyText}>No leads found</Text>
            <Text style={styles.emptySub}>Try changing filters or add a new lead.</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>

            <CustomDropDown iconName="fact-check"  uprLabel="Status" value={filterStatus} setValue={setFilterStatus} data={STATUS_OPTIONS} />
            <CustomDropDown iconName="source"  uprLabel="Source" value={filterSource} setValue={setFilterSource} data={SOURCE_OPTIONS} />
            <CustomDropDown iconName="location-city"  uprLabel="City" value={filterCity} setValue={setFilterCity} data={CITY_OPTIONS} />

            <View style={[styles.modalActions, {gap: responsiveWidth(2)}]}>
              <View style={{flex:1}}>
                <CustomButton title="Clear" onPress={() => { setFilterStatus(''); setFilterSource(''); setFilterCity('') }} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
              </View>
              <View style={{flex:1}}>
                <CustomButton title="Apply" onPress={() => setFilterModalVisible(false)} bgColor={Colors.primary} color={Colors.white} />
              </View>
            </View>

            <Pressable style={styles.modalClose} onPress={() => setFilterModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={responsiveFontSize(2.2)} color={Colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Floating Add Lead FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation && navigation.navigate('AddLead')}>
        <MaterialCommunityIcons name="plus" size={22} color={Colors.white} />
        <Text style={styles.fabLabel}>Add Lead</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Leads

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(8),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    elevation: 2,
  },
  container: { padding: responsiveWidth(3), paddingBottom: responsiveHeight(16) },

  summaryWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: responsiveHeight(1), marginHorizontal: responsiveWidth(1), gap: responsiveHeight(1) },
  summaryCol: { width: '23%', padding: responsiveWidth(0),},
  summaryCard: {
    borderRadius: 10,
    padding: responsiveWidth(3),
    minHeight: responsiveHeight(10),
    justifyContent: 'center',
    elevation: 1,
  },
  summaryCount: { fontSize: responsiveFontSize(2.2), fontWeight: '700', marginTop: responsiveHeight(0.5) },
  summaryLabel: { fontSize: responsiveFontSize(1.2), color: Colors.textSecondary, marginTop: responsiveHeight(0.5) },

  searchWrap: { flex:1, flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(1), paddingHorizontal: responsiveWidth(1) },
  searchbar: {
    borderRadius: responsiveWidth(8),
    elevation: 2,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: Colors.primaryWithOpacity,
    borderWidth: 1,
    height: responsiveHeight(4.5),
    justifyContent: 'center', // 👈 center content
    paddingVertical: 0,
  },
  searchInput: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.black,
    fontWeight: '500',
    paddingBottom: 0,
    paddingTop: 0,
    minHeight: responsiveHeight(4),
  },
  filterShortBtn: { marginLeft: responsiveWidth(2), padding: responsiveWidth(2), backgroundColor: Colors.white, borderRadius: 8, elevation: 1 },

  activeFiltersRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: responsiveHeight(1) },
  activeText: { color: Colors.textSecondary, fontSize: responsiveFontSize(1.2) },
  clearText: { color: Colors.primary, fontWeight: '700' },

  sectionTitle: { marginTop: responsiveHeight(1), marginBottom: responsiveHeight(1), fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, paddingHorizontal: responsiveWidth(1) },

  leadCard: { backgroundColor: Colors.white, borderRadius: 10, padding: responsiveWidth(3), marginBottom: responsiveHeight(1.2), elevation: 1 },
  leadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leadName: { fontSize: responsiveFontSize(1.8), fontWeight: '700', color: Colors.textPrimary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: Colors.white, fontWeight: '700' },
  leadSource: { color: Colors.textSecondary, marginTop: responsiveHeight(0.6) },
  leadMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(0.8) },
  leadMeta: { color: Colors.textSecondary },
  leadMetaSmall: { color: Colors.textTertiary },

  leadActions: { flexDirection: 'row', marginTop: responsiveHeight(1) },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(4) },
  actionLabel: { marginLeft: responsiveWidth(1), color: Colors.textSecondary },

  empty: { alignItems: 'center', marginTop: responsiveHeight(12) },
  emptyText: { marginTop: responsiveHeight(2), fontSize: responsiveFontSize(1.6), color: Colors.textSecondary },
  emptySub: { marginTop: responsiveHeight(0.5), color: Colors.textTertiary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, padding: responsiveWidth(4), borderTopLeftRadius: 12, borderTopRightRadius: responsiveWidth(2), minHeight: responsiveHeight(40) },
  modalTitle: { fontSize: responsiveFontSize(1.8), fontWeight: '700', marginBottom: responsiveHeight(1.5) },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(2) },
  modalClose: { position: 'absolute', right: responsiveWidth(4), top: responsiveHeight(1.5) },

  fab: {
    position: 'absolute',
    right: responsiveWidth(4),
    bottom: responsiveHeight(4),
    backgroundColor: Colors.primary,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: responsiveWidth(6),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
  },
  fabLabel: { color: Colors.white, marginLeft: responsiveWidth(2), fontWeight: '700' },
})
