import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
  Image,
} from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Colors from '../../../style/Colors'
import CustomInput from '../../../components/CustomInput'
import CustomDropDown from '../../../components/CustomDropDown'
import CustomButton from '../../../components/CustomButton'
import PickImageComponent from '../../../components/PickImageComponent'

const FEEDBACK_TYPES = [
  { label: 'Bug Report', value: 'Bug Report' },
  { label: 'Feature Request', value: 'Feature Request' },
  { label: 'Suggestion', value: 'Suggestion' },
  { label: 'Other', value: 'Other' },
]

const mockPreviousFeedbacks = [
  {
    id: '1',
    type: 'Bug Report',
    subject: 'App crashes on profile edit',
    createdAt: '2025-10-28T10:00:00Z',
    status: 'Submitted',
  },
  {
    id: '2',
    type: 'Feature Request',
    subject: 'Add dark mode theme',
    createdAt: '2025-10-25T14:30:00Z',
    status: 'Pending',
  },
]

const Feedback = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [previous, setPrevious] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  // Form state
  const [type, setType] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState({ name: '', email: '' })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const rawProfile = await AsyncStorage.getItem('profile')
        const p = rawProfile ? JSON.parse(rawProfile) : { name: '', email: '' }

        // Using mock data for demonstration
        const prevRaw = mockPreviousFeedbacks; 
        // In a real app, you might fetch from storage:
        // const prevRaw = await AsyncStorage.getItem('submitted_feedbacks')
        
        if (!mounted) return

        setUser({ name: p.name ?? '', email: p.email ?? '' })
        setPrevious(prevRaw || [])

      } catch (e) {
        console.warn('Failed to load feedback data', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const resetForm = () => {
    setType('')
    setSubject('')
    setMessage('')
    setAttachment(null)
  }

  const handleOpenModal = () => {
    resetForm()
    setModalVisible(true)
  }

  const validate = () => {
    if (!type) {
      Alert.alert('Validation', 'Please select feedback type.')
      return false
    }
    if (!subject.trim()) {
      Alert.alert('Validation', 'Please enter a subject.')
      return false
    }
    if (!message.trim()) {
      Alert.alert('Validation', 'Please enter a description.')
      return false
    }
    return true
  }

  const pickAttachment = async () => {
    try {
      const asset = await PickImageComponent()
      if (!asset) return
      setAttachment({ uri: asset.uri, name: asset.fileName || 'attachment.jpg', type: asset.type || 'image/jpeg' })
    } catch (err) {
      Alert.alert('Attachment Error', 'Unable to pick attachment.')
    }
  }

  const submitFeedbackApi = async (payload) => {
    // Mock API call
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  }

  const onSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)

    const payload = {
      id: Date.now().toString(),
      type,
      subject,
      message,
      user,
      createdAt: new Date().toISOString(),
      status: 'Submitted', // Default status
    }

    try {
      await submitFeedbackApi(payload)

      const newPrev = [payload, ...previous]
      setPrevious(newPrev)
      await AsyncStorage.setItem('submitted_feedbacks', JSON.stringify(newPrev))

      setIsSubmitting(false)
      setModalVisible(false)

      if (Platform.OS === 'android') {
        ToastAndroid.show('Feedback submitted successfully', ToastAndroid.SHORT)
      } else {
        Alert.alert('Success', 'Feedback submitted successfully')
      }

    } catch (err) {
      // Handle offline submission
      const pendingRaw = await AsyncStorage.getItem('pending_feedbacks')
      const pending = pendingRaw ? JSON.parse(pendingRaw) : []
      const pendingPayload = { ...payload, status: 'Pending' };
      
      await AsyncStorage.setItem('pending_feedbacks', JSON.stringify([pendingPayload, ...pending]))
      
      // Also add to the current view with 'Pending' status
      setPrevious(p => [pendingPayload, ...p]);

      setIsSubmitting(false)
      setModalVisible(false)
      Alert.alert('Submission Failed', 'Saved locally and will sync when online.')
    }
  }

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.prevRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.prevType}>
          {item.type} • {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.prevSub}>{item.subject}</Text>
      </View>
      <Text
        style={[
          styles.prevStatus,
          item.status === 'Submitted'
            ? { color: Colors.success }
            : { color: Colors.textSecondary },
        ]}
      >
        {item.status ?? 'Pending'}
      </Text>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.safe}>
      {/* Header */}
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
        <Text style={styles.title}>My Feedback</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Feedback List or Empty State */}
      <View style={styles.container}>
        {previous.length > 0 ? (
          <FlatList
            data={previous}
            keyExtractor={(item) => item.id}
            renderItem={renderFeedbackItem}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(12),
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: responsiveHeight(1) }} />
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={responsiveFontSize(5)}
              color={Colors.primary}
            />
            <Text style={styles.emptyText}>No Feedback Submitted</Text>
            <Text style={styles.emptySub}>
              Click the button below to add your first feedback.
            </Text>
          </View>
        )}
      </View>

      {/* Floating Add FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenModal}
      >
        <MaterialCommunityIcons
          name="plus"
          size={responsiveFontSize(3.5)}
          color={Colors.white}
        />
      </TouchableOpacity>

      {/* Add Feedback Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit New Feedback</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={responsiveFontSize(2.5)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{gap: responsiveHeight(1.5)}}>
                <CustomDropDown iconName="feedback" uprLabel="Feedback Type *" value={type} setValue={setType} data={FEEDBACK_TYPES} placeholder="Select type" />
                <CustomInput icon="edit" label="Subject *" value={subject} onChangeText={setSubject} placeholder="Short title" />
                <CustomInput icon="description" label="Description *" value={message} onChangeText={setMessage} placeholder="Describe the issue or suggestion" multiline />

                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TouchableOpacity style={styles.attachBtn} onPress={pickAttachment}>
                    <MaterialCommunityIcons name="paperclip" size={responsiveFontSize(2)} color={Colors.primary} />
                    <Text style={styles.attachText}>{attachment ? '1 file attached' : 'Add Attachment'}</Text>
                  </TouchableOpacity>
                  {attachment && (
                    <Image source={{ uri: attachment.uri }} style={styles.preview} />
                  )}
                </View> */}
              </View>

              <View style={styles.modalActions}>
                <View style={{flex: 1}}>
                  <CustomButton
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                    bgColor={Colors.white}
                    color={Colors.primary}
                    borderC={Colors.primary}
                  />
                </View>
                <View style={{flex: 1}}>
                  <CustomButton
                    title="Submit"
                    onPress={onSubmit}
                    isLoading={isSubmitting}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Feedback

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
  },
  back: { width: responsiveWidth(10), justifyContent: 'center' },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },

  container: {
    flex: 1,
    padding: responsiveWidth(4),
    paddingBottom: responsiveHeight(6),
  },

  prevRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveWidth(3),
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(2),
    elevation: 1,
  },
  prevType: { fontWeight: '700' },
  prevSub: { color: Colors.textSecondary },
  prevStatus: {
    marginLeft: responsiveWidth(2),
    fontWeight: '700',
  },

  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

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

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -responsiveHeight(10),
  },
  emptyText: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(1.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  emptySub: {
    marginTop: responsiveHeight(0.6),
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: responsiveWidth(10),
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: responsiveWidth(4),
    borderTopRightRadius: responsiveWidth(4),
    padding: responsiveWidth(4),
    maxHeight: responsiveHeight(80),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  modalTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  attachText: { color: Colors.primary, fontWeight: '600' },
  preview: { width: responsiveWidth(12), height: responsiveWidth(12), borderRadius: 8 },
  modalActions: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
    marginTop: responsiveHeight(3),
  },
})
