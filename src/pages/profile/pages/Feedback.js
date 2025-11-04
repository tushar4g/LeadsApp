import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ToastAndroid,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomInput from '../../../components/CustomInput'
import CustomDropDown from '../../../components/CustomDropDown'
import CustomButton from '../../../components/CustomButton'
import PickImageComponent from '../../../components/PickImageComponent'
import Colors from '../../../style/Colors'

const FEEDBACK_TYPES = [
  { label: 'Bug Report', value: 'Bug Report' },
  { label: 'Feature Request', value: 'Feature Request' },
  { label: 'Suggestion', value: 'Suggestion' },
  { label: 'Other', value: 'Other' },
]

const Feedback = ({ navigation }) => {
  const [type, setType] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({ name: '', email: '' })
  const [previous, setPrevious] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('profile')
        const p = raw ? JSON.parse(raw) : { name: '', email: '' }
        if (!mounted) return
        setUser({ name: p.name ?? '', email: p.email ?? '' })

        const prevRaw = await AsyncStorage.getItem('submitted_feedbacks')
        if (prevRaw) setPrevious(JSON.parse(prevRaw))
      } catch (e) {
        // ignore
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const validate = () => {
    if (!type) {
      Alert.alert('Validation', 'Please select feedback type.')
      return false
    }
    if (!subject.trim()) {
      Alert.alert('Validation', 'Please enter subject.')
      return false
    }
    if (!message.trim()) {
      Alert.alert('Validation', 'Please enter description.')
      return false
    }
    return true
  }

  const pickAttachment = async () => {
    try {
      const asset = await PickImageComponent()
      if (!asset) return
      // PickImageComponent returns asset with uri, fileName, type, etc.
      setAttachment({ uri: asset.uri, name: asset.fileName || asset.fileName || 'attachment.jpg', type: asset.type || 'image/jpeg' })
    } catch (err) {
      console.warn('pickAttachment error', err)
      Alert.alert('Attachment Error', 'Unable to pick attachment.')
    }
  }

  const submitFeedbackApi = async (payload) => {
    const url = 'https://api.example.com/feedback'
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Submission failed')
      }
      return true
    } catch (e) {
      throw e
    }
  }

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    const payload = {
      type,
      subject,
      message,
      attachment,
      user,
      createdAt: new Date().toISOString(),
    }

    try {
      await submitFeedbackApi(payload)

      const newPrev = [{ id: Date.now().toString(), ...payload, status: 'Submitted' }, ...previous]
      setPrevious(newPrev)
      await AsyncStorage.setItem('submitted_feedbacks', JSON.stringify(newPrev))

      setType('')
      setSubject('')
      setMessage('')
      setAttachment(null)
      setLoading(false)
      if (Platform.OS === 'android') {
        ToastAndroid.show('Feedback submitted successfully', ToastAndroid.SHORT)
      } else {
        Alert.alert('Success', 'Feedback submitted successfully')
      }
      navigation?.goBack?.()
    } catch (err) {
      const pendingRaw = await AsyncStorage.getItem('pending_feedbacks')
      const pending = pendingRaw ? JSON.parse(pendingRaw) : []
      await AsyncStorage.setItem('pending_feedbacks', JSON.stringify([{ id: Date.now().toString(), ...payload }, ...pending]))

      setLoading(false)
      Alert.alert('Submission failed', err?.message || 'Saved locally and will sync when online.')
    }
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.back}>
          <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.2)} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Feedback & Suggestions</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.introCard}>
          <MaterialCommunityIcons name="message-text-outline" size={28} color={Colors.primary} />
          <Text style={styles.introText}>
            We value your feedback. Help us improve your experience by sharing your thoughts below.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Info</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>{user.name || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>{user.email || '—'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Submit Feedback</Text>

          <CustomDropDown uprLabel="Feedback Type" value={type} setValue={setType} data={FEEDBACK_TYPES} placeholder="Select type" />

          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomInput label="Subject" value={subject} onChangeText={setSubject} placeholder="Short title" />
          </View>

          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomInput label="Description" value={message} onChangeText={setMessage} placeholder="Describe the issue or suggestion" multiline />
          </View>

          <View style={{ marginTop: responsiveHeight(1), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity style={styles.attachBtn} onPress={pickAttachment}>
              <MaterialCommunityIcons name="paperclip" size={18} color={Colors.primary} />
              <Text style={styles.attachText}>{attachment ? 'Attachment added' : 'Add Attachment'}</Text>
            </TouchableOpacity>

            <CustomButton title="Submit Feedback" onPress={onSubmit} isLoading={loading} bgColor={Colors.primary} color={Colors.white} />
          </View>

          {attachment && (
            <View style={{ marginTop: responsiveHeight(1) }}>
              <Image source={{ uri: attachment.uri }} style={styles.preview} />
            </View>
          )}
        </View>

        {previous.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Previous Submissions</Text>
            {previous.map((p) => (
              <View key={p.id} style={styles.prevRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prevType}>{p.type} • {new Date(p.createdAt).toLocaleDateString()}</Text>
                  <Text style={styles.prevSub}>{p.subject}</Text>
                </View>
                <Text style={[styles.prevStatus, p.status === 'Submitted' ? { color: Colors.success } : { color: Colors.textSecondary }]}>{p.status ?? 'Pending'}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: responsiveHeight(6) }} />
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
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
  title: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },

  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(6) },

  introCard: { backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(3), marginBottom: responsiveHeight(1), flexDirection: 'row', gap: responsiveWidth(3), alignItems: 'center' },
  introText: { marginLeft: responsiveWidth(2), color: Colors.textPrimary, flex: 1 },

  card: { backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(3), marginBottom: responsiveHeight(1.2), elevation: 1 },

  sectionTitle: { fontSize: responsiveFontSize(1.2), fontWeight: '700', color: Colors.textPrimary, marginBottom: responsiveHeight(0.6) },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(0.6) },
  infoText: { marginLeft: responsiveWidth(2), color: Colors.textPrimary },

  attachBtn: { flexDirection: 'row', alignItems: 'center' },
  attachText: { marginLeft: responsiveWidth(2), color: Colors.textSecondary },

  preview: { width: responsiveWidth(40), height: responsiveWidth(28), borderRadius: 8, marginTop: responsiveHeight(0.8) },

  prevRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(0.8), borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  prevType: { fontWeight: '700' },
  prevSub: { color: Colors.textSecondary },
  prevStatus: { marginLeft: responsiveWidth(2), fontWeight: '700' },

  loadingOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },
})