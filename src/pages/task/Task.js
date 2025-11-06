import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import Colors from '../../style/Colors'
import CustomInput from '../../components/CustomInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomButton from '../../components/CustomButton'
import CustomDateTimePicker from '../../components/CustomDateTimePicker'
import { Searchbar } from 'react-native-paper'

/* --- Mock API / Data (replace with real API) --- */
const TODAY_ISO = new Date().toISOString().split('T')[0]

const MOCK_TASKS = [
  {
    id: 't1',
    title: 'Follow up with Dr. Anil Mehta',
    description: 'Discuss ECG report and next steps',
    leadName: 'Dr. Anil Mehta',
    assignedTo: 'Field Exec 1',
    priority: 'High',
    status: 'Pending',
    due: `${TODAY_ISO}T11:00:00Z`,
    createdAt: `${TODAY_ISO}T08:00:00Z`,
  },
  {
    id: 't2',
    title: 'Call Rekha Singh',
    description: 'Intro call and qualification',
    leadName: 'Ms. Rekha Singh',
    assignedTo: 'Admin',
    priority: 'Medium',
    status: 'In Progress',
    due: `${TODAY_ISO}T15:00:00Z`,
    createdAt: `${TODAY_ISO}T09:00:00Z`,
  },
  {
    id: 't3',
    title: 'Submit reports',
    description: 'Upload visit reports for Dr. Rajiv Patel',
    leadName: 'Dr. Rajiv Patel',
    assignedTo: 'Field Exec 2',
    priority: 'Low',
    status: 'Completed',
    due: `${TODAY_ISO}T09:00:00Z`,
    createdAt: `${TODAY_ISO}T07:00:00Z`,
  },
]

const fakeApi = {
  getTasks: async (opts = {}) =>
    new Promise((res) =>
      setTimeout(() => {
        let list = [...MOCK_TASKS]
        if (opts.search) {
          const s = opts.search.toLowerCase()
          list = list.filter((t) => (t.title + t.description + t.leadName).toLowerCase().includes(s))
        }
        if (opts.status && opts.status !== 'All') list = list.filter((t) => t.status === opts.status)
        if (opts.priority && opts.priority !== 'All') list = list.filter((t) => t.priority === opts.priority)
        res(list)
      }, 350)
    ),
  updateTaskStatus: async (id, status) =>
    new Promise((res) =>
      setTimeout(() => {
        const idx = MOCK_TASKS.findIndex((t) => t.id === id)
        if (idx >= 0) MOCK_TASKS[idx].status = status
        res(true)
      }, 300)
    ),
  deleteTask: async (id) =>
    new Promise((res) =>
      setTimeout(() => {
        const idx = MOCK_TASKS.findIndex((t) => t.id === id)
        if (idx >= 0) MOCK_TASKS.splice(idx, 1)
        res(true)
      }, 300)
    ),
}

/* --- UI helpers --- */
const STATUS_COLORS = {
  Pending: '#f59e0b', // yellow
  'In Progress': Colors.info || '#0ea5e9',
  Completed: Colors.success || '#16a34a',
  Overdue: Colors.secondary || '#ef4444',
}

const PRIORITY_COLORS = {
  High: Colors.secondary || '#ef4444',
  Medium: '#f59e0b',
  Low: Colors.gray || '#9ca3af',
}

/* --- Component --- */
const Task = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState({ status: 'All', priority: 'All', assignedTo: 'All', due: 'All' })
  const [selectedTask, setSelectedTask] = useState(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const searchRef = useRef(null)
  const [showSearch, setShowSearch] = useState(false)

  const load = async (opts = {}) => {
    setLoading(true)
    try {
      const list = await fakeApi.getTasks({ search: opts.search ?? search, status: opts.status ?? filters.status, priority: opts.priority ?? filters.priority })
      setTasks(list)
    } catch (e) {
      Alert.alert('Error', 'Unable to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const applyFilters = (newFilters) => {
    setFilters((f) => ({ ...f, ...newFilters }))
    setFilterModal(false)
    load({ status: newFilters.status ?? filters.status, priority: newFilters.priority ?? filters.priority })
  }

  const markComplete = async (id) => {
    await fakeApi.updateTaskStatus(id, 'Completed')
    Alert.alert('Success', 'Task marked completed')
    load()
  }

  const deleteTask = (id) => {
    Alert.alert('Delete', 'Delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await fakeApi.deleteTask(id)
          load()
        },
      },
    ])
  }

  const openDetails = (task) => {
    setSelectedTask(task)
    setDetailsVisible(true)
  }

  const renderSummary = () => {
    const total = tasks.length
    const pending = tasks.filter((t) => t.status === 'Pending').length
    const completed = tasks.filter((t) => t.status === 'Completed').length
    const overdue = tasks.filter((t) => new Date(t.due) < new Date() && t.status !== 'Completed').length

    const stat = (label, count, icon, color) => (
      <View style={styles.statCard}>
        <View style={[styles.statBadge, { backgroundColor: `${color}80` }]}>
          <MaterialCommunityIcons name={icon} size={responsiveFontSize(1.8)} color={Colors.white} />
        </View>
        <View style={{ marginLeft: responsiveWidth(2) }}>
          <Text style={styles.statCount}>{count}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </View>
    )

    return (
      <View style={styles.summary}>
        {stat('Total', total, 'clipboard-list', Colors.primary)}
        {stat('Pending', pending, 'clock-outline', STATUS_COLORS.Pending)}
        {stat('Completed', completed, 'check-circle-outline', STATUS_COLORS.Completed)}
        {stat('Overdue', overdue, 'alert-circle-outline', STATUS_COLORS.Overdue)}
      </View>
    )
  }

  const renderTask = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status] || Colors.gray
    const prColor = PRIORITY_COLORS[item.priority] || Colors.gray

    return (
        <Pressable onPress={() => openDetails(item)} style={styles.card} android_ripple={{ color: Colors.background }}>
            <View style={styles.cardLeft}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={responsiveFontSize(3)} color={Colors.white} />
            </View>

            <View style={styles.cardBody}>
                <View style={styles.row}>
                    <Text style={styles.title} numberOfLines={1}>
                    {item.leadName}
                    </Text>

                    <View style={[styles.badge, { backgroundColor: statusColor }]}>
                        <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                </View>

                <Text style={styles.subText} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.subText} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="schedule" size={responsiveFontSize(1.6)} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{new Date(item.due).toLocaleString()}</Text>
                    </View>

                    <View style={styles.metaItem}>
                        <MaterialIcons name="account-circle" size={responsiveFontSize(1.6)} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{item.leadName}</Text>
                    </View>

                    {/* <View style={styles.metaItem}>
                        <View style={[styles.priorityBadge, { backgroundColor: prColor }]}>
                            <Text style={styles.priorityText}>{item.priority}</Text>
                        </View>
                    </View> */}
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => markComplete(item.id)}>
                        <MaterialIcons name="check-circle" size={responsiveFontSize(1.8)} color={Colors.success} />
                        <Text style={styles.actionLabel}>Complete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation?.navigate('AddTask', { mode: 'edit', task: item })}>
                        <MaterialIcons name="edit" size={responsiveFontSize(1.8)} color={Colors.info} />
                        <Text style={styles.actionLabel}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => deleteTask(item.id)}>
                        <MaterialIcons name="delete-outline" size={responsiveFontSize(1.8)} color={Colors.secondary} />
                        <Text style={[styles.actionLabel, { color: Colors.secondary }]}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => openDetails(item)}>
                        <MaterialIcons name="search" size={responsiveFontSize(1.8)} color={Colors.textSecondary} />
                        <Text style={styles.actionLabel}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Pressable>
    )
  }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: responsiveWidth(2) }}>
                <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.6)} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tasks / To-Dos</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setShowSearch(true)} style={{ padding: responsiveWidth(1) }}>
                    <MaterialIcons name="search" size={responsiveFontSize(2.2)} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterModal(true)} style={{ padding: responsiveWidth(1) }}>
                    <MaterialIcons name="filter-list" size={responsiveFontSize(2.4)} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>

        {showSearch && (
            <View style={styles.searchRow}>
                <Searchbar
                    ref={searchRef}
                    placeholder="Search tasks, leads, notes..."
                    value={search}
                    onChangeText={(t) => setSearch(t)}
                    onSubmitEditing={() => load({ search })}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    icon={() => <MaterialIcons name="search" size={responsiveFontSize(1.8)} color={Colors.textSecondary} />}
                    clearIcon={search ? () => <MaterialIcons name="close" size={responsiveFontSize(1.8)} color={Colors.textSecondary} /> : null}
                />
            </View>
        )}

        <ScrollView
            contentContainerStyle={{ padding: responsiveWidth(3) }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {renderSummary()}

            {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: responsiveHeight(8) }} />
            ) : tasks.length === 0 ? (
            <View style={styles.emptyState}>
                <MaterialIcons name="task-alt" size={responsiveFontSize(4.5)} color={Colors.primary} />
                <Text style={styles.emptyText}>No tasks available. Tap + to add one.</Text>
                <Text style={styles.emptySub}>All tasks you assign or receive will be listed here.</Text>
            </View>
            ) : (
            <FlatList data={tasks} keyExtractor={(i) => i.id} renderItem={renderTask} scrollEnabled={false} />
            )}
        </ScrollView>

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            <CustomDropDown
                title="Status"
                value={filters.status}
                setValue={(v) => setFilters((s) => ({ ...s, status: v }))}
                data={[
                    { label: 'All', value: 'All' },
                    { label: 'Pending', value: 'Pending' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Completed', value: 'Completed' },
                ]}
            />
            <CustomDropDown
                title="Priority"
                value={filters.priority}
                setValue={(v) => setFilters((s) => ({ ...s, priority: v }))}
                data={[
                    { label: 'All', value: 'All' },
                    { label: 'High', value: 'High' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'Low', value: 'Low' },
                ]}
            />

            <View style={styles.modalActions}>
                <View style={{ flex: 1 }}>
                    <CustomButton
                        title="Clear"
                        onPress={() => {
                            setFilters({ status: 'All', priority: 'All', assignedTo: 'All', due: 'All' })
                        }}
                        bgColor={Colors.white}
                        color={Colors.primary}
                        borderC={Colors.primary}
                    />
                </View>
                <View style={{ width: responsiveWidth(2) }} />
                <View style={{ flex: 1 }}>
                    <CustomButton title="Apply" onPress={() => applyFilters(filters)} bgColor={Colors.primary} color={Colors.white} />
                </View>
            </View>

            <TouchableOpacity style={styles.modalClose} onPress={() => setFilterModal(false)}>
                <MaterialCommunityIcons name="close" size={responsiveFontSize(2.2)} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal visible={detailsVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBoxLarge}>
            <ScrollView>
              {selectedTask ? (
                <>
                    <View style={styles.detailsHeader}>
                        <Text style={styles.detailsTitle}>{selectedTask.title}</Text>
                        <View style={[styles.statusChip, { backgroundColor: STATUS_COLORS[selectedTask.status] || Colors.gray }]}>
                        <Text style={styles.statusText}>{selectedTask.status}</Text>
                        </View>
                    </View>

                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>{selectedTask.description || '—'}</Text>

                    <Text style={styles.detailLabel}>Lead / Doctor</Text>
                    <Text style={styles.detailValue}>{selectedTask.leadName}</Text>

                    <Text style={styles.detailLabel}>Assigned To</Text>
                    <Text style={styles.detailValue}>{selectedTask.assignedTo}</Text>

                    <Text style={styles.detailLabel}>Created</Text>
                    <Text style={styles.detailValue}>{new Date(selectedTask.createdAt).toLocaleString()}</Text>

                    <Text style={styles.detailLabel}>Due</Text>
                    <Text style={styles.detailValue}>{new Date(selectedTask.due).toLocaleString()}</Text>

                    <View style={{ marginTop: responsiveHeight(2) }}>
                        <CustomButton title="Edit Task" onPress={() => { setDetailsVisible(false); navigation?.navigate('AddTask', { mode: 'edit', task: selectedTask }) }} />
                        <View style={{ height: responsiveHeight(1) }} />
                        <CustomButton title="Mark Complete" onPress={() => { markComplete(selectedTask.id); setDetailsVisible(false) }} bgColor={Colors.primary} color={Colors.white} />
                        <View style={{ height: responsiveHeight(1) }} />
                        <CustomButton title="Delete Task" onPress={() => { deleteTask(selectedTask.id); setDetailsVisible(false) }} bgColor={Colors.white} color={Colors.secondary} borderC={Colors.secondary} />
                        <View style={{ height: responsiveHeight(1) }} />
                        <CustomButton title="Close" onPress={() => setDetailsVisible(false)} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
                    </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation?.navigate('AddTask')}>
        <MaterialIcons name="add" size={responsiveFontSize(2.8)} color={Colors.white} />
      </TouchableOpacity>
    </View>
  )
}

export default Task

/* --- Styles --- */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        height: responsiveHeight(7),
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        elevation: 2,
    },
    headerTitle: { color: Colors.white, fontSize: responsiveFontSize(2.2), fontWeight: '700', textAlign: 'center', flex: 1 },
    searchRow: { flexDirection: 'row', paddingHorizontal: responsiveWidth(3), alignItems: 'center', marginTop: responsiveHeight(2)},
    searchBar: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: responsiveWidth(3),
        borderWidth: 1,
        borderColor: Colors.textSecondary,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: responsiveHeight(4.5), // 👈 reduce height
        justifyContent: 'center', // 👈 center content
        paddingVertical: 0,
    },
    searchInput: {
        fontSize: responsiveFontSize(1.6),
        color: Colors.black,
        fontWeight: '600',
        paddingBottom: 0,
        paddingTop: 0,
        textAlignVertical: 'center', // 👈 centers text on Android
        minHeight: responsiveHeight(4), // 👈 ensure input doesn't grow too tall
    },
    summary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveHeight(1) },
    statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: responsiveWidth(3), borderRadius: 10, flex: 1, marginRight: responsiveWidth(2), elevation: 2 },
    statBadge: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statCount: { fontSize: responsiveFontSize(1.8), fontWeight: '800', color: Colors.textPrimary },
    statLabel: { fontSize: responsiveFontSize(1.2), color: Colors.textSecondary },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: responsiveWidth(3),
        padding: responsiveWidth(3.5),
        elevation: 2,
        alignItems: 'flex-start',
        marginBottom: responsiveHeight(1),
    },
    cardLeft: { marginRight: responsiveWidth(3), width: responsiveWidth(12), height: responsiveWidth(12), borderRadius: responsiveWidth(6), backgroundColor: Colors.primary,alignItems: 'center', justifyContent: 'center' },
    cardBody: { flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: responsiveHeight(0.6) },
    title: { fontSize: responsiveFontSize(1.8), fontWeight: '700', color: Colors.textPrimary, flex: 1 },
    subText: { color: Colors.textSecondary, fontSize: responsiveFontSize(1.4), marginBottom: responsiveHeight(0.6) },
    metaRow: { flexDirection: 'row', marginTop: responsiveHeight(0.5), alignItems: 'center', justifyContent: 'space-between' },
    metaItem: { flexDirection: 'row', alignItems: 'center' },
    metaText: { marginLeft: responsiveWidth(1), color: Colors.textSecondary, fontSize: responsiveFontSize(1.2) },
    badge: { paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveHeight(0.4), borderRadius: responsiveWidth(2), alignSelf: 'flex-start' },
    badgeText: { color: Colors.white, fontWeight: '700', fontSize: responsiveFontSize(1.1) },
    priorityBadge: { paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveHeight(0.3), borderRadius: responsiveWidth(2) },
    priorityText: { color: Colors.white, fontWeight: '700', fontSize: responsiveFontSize(1.1) },
    actionRow: { flexDirection: 'row', marginTop: responsiveHeight(1), justifyContent: 'flex-start', gap: responsiveWidth(3) },
    actionBtn: { flexDirection: 'row', alignItems: 'center', },
    actionLabel: { marginLeft: responsiveWidth(1), color: Colors.textSecondary, fontSize: responsiveFontSize(1.2) },
    emptyState: { alignItems: 'center', marginTop: responsiveHeight(8) },
    emptyText: { marginTop: responsiveHeight(2), fontSize: responsiveFontSize(1.8), color: Colors.textSecondary, fontWeight: '600' },
    emptySub: { marginTop: responsiveHeight(0.6), color: Colors.textTertiary, fontSize: responsiveFontSize(1.2) },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, padding: responsiveWidth(4), borderTopLeftRadius: 12, borderTopRightRadius: 12, minHeight: responsiveHeight(40) },
    modalTitle: { fontSize: responsiveFontSize(1.8), fontWeight: '700', marginBottom: responsiveHeight(1.5) },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(2) },
    modalClose: { position: 'absolute', right: responsiveWidth(4), top: responsiveHeight(1.5) },
    modalBoxLarge: { marginHorizontal: responsiveWidth(3), backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(3), maxHeight: '85%' },
    detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: responsiveHeight(1) },
    detailsTitle: { fontSize: responsiveFontSize(1.8), fontWeight: '800' },
    detailLabel: { color: Colors.textSecondary, marginTop: responsiveHeight(1), fontWeight: '700', fontSize: responsiveFontSize(1.2) },
    detailValue: { color: Colors.textPrimary, marginTop: responsiveHeight(0.4), fontSize: responsiveFontSize(1.4) },
    statusChip: { paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveHeight(0.4), borderRadius: 12 },
    statusText: { color: Colors.white, fontWeight: '700', fontSize: responsiveFontSize(1.2) },
    fab: {
        position: 'absolute',
        right: responsiveWidth(6),
        bottom: responsiveHeight(4),
        backgroundColor: Colors.primary,
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        borderRadius: responsiveWidth(7),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
    },
})