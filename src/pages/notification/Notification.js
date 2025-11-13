import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../style/Colors'

const mockNotifications = [
  {
    id: '1',
    type: 'reminder',
    title: 'Follow-up with Dr. Sharma',
    time: '10 mins ago',
    read: false,
  },
  {
    id: '2',
    type: 'alert',
    title: 'Task "Prepare monthly report" is overdue!',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'update',
    title: 'New lead "Patient X" assigned to you.',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'reward',
    title: 'You earned 50 reward points!',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Appointment with Dr. Mehta at 4 PM',
    time: 'Yesterday',
    read: true,
  },
]

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState(mockNotifications)

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getIconForType = (type) => {
    switch (type) {
      case 'reminder':
        return { name: 'bell-ring', color: Colors.warning }
      case 'alert':
        return { name: 'alert-circle', color: Colors.error }
      case 'update':
        return { name: 'information', color: Colors.info }
      case 'reward':
        return { name: 'gift', color: Colors.success }
      default:
        return { name: 'bell', color: Colors.textSecondary }
    }
  }

  const renderItem = ({ item }) => {
    const icon = getIconForType(item.type)
    return (
      <TouchableOpacity
        style={[styles.item, !item.read && styles.itemUnread]}
        onPress={() => handleMarkAsRead(item.id)}
      >
        <View style={[styles.iconWrap, { backgroundColor: `${icon.color}20` }]}>
          <MaterialCommunityIcons
            name={icon.name}
            size={responsiveFontSize(2.5)}
            color={icon.color}
          />
        </View>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.back}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={responsiveFontSize(2.2)}
            color={Colors.white}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAll}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={responsiveFontSize(6)}
            color={Colors.textSecondary}
          />
          <Text style={styles.emptyText}>No new notifications</Text>
          <Text style={styles.emptySub}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
  },
  back: { padding: responsiveWidth(1) },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },
  markAll: { padding: responsiveWidth(1) },
  markAllText: { color: Colors.white, fontSize: responsiveFontSize(1.4) },
  listContainer: { padding: responsiveWidth(4), gap: responsiveHeight(1.5) },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: responsiveWidth(3),
    borderRadius: 12,
    elevation: 1,
  },
  itemUnread: { backgroundColor: Colors.lightPrimary },
  iconWrap: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(5.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(3),
  },
  itemBody: { flex: 1 },
  itemTitle: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  itemTime: {
    fontSize: responsiveFontSize(1.3),
    color: Colors.textSecondary,
    marginTop: responsiveHeight(0.5),
  },
  unreadDot: {
    width: responsiveWidth(2.5),
    height: responsiveWidth(2.5),
    borderRadius: responsiveWidth(1.25),
    backgroundColor: Colors.primary,
    marginLeft: responsiveWidth(2),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(10),
  },
  emptyText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: responsiveHeight(2),
  },
  emptySub: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textTertiary,
    marginTop: responsiveHeight(1),
  },
})