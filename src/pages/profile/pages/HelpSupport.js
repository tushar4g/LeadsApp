import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
  Pressable,
} from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../../style/Colors'
import CustomInput from '../../../components/CustomInput'

const FAQ_DATA = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password from the profile screen. Navigate to Profile > Change Password and follow the on-screen instructions.',
  },
  {
    question: 'How can I update my profile information?',
    answer: 'To update your profile, go to the "My Profile" section from the main profile page. There you can edit your name, email, and other personal details.',
  },
  {
    question: 'Where can I see my reward points?',
    answer: 'Your reward points are displayed in the "My Rewards" section. You can access this from the profile screen to see your earned points, history, and redemption options.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. All your data is encrypted and stored securely. For more details, please refer to our Privacy Policy.',
  },
]

const CollapsibleItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <View style={styles.faqItem}>
      <Pressable onPress={toggleExpand} style={styles.faqQuestionRow}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={responsiveFontSize(2.5)}
          color={Colors.primary}
        />
      </Pressable>
      {expanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  )
}

const HelpSupport = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleEmail = () => Linking.openURL('mailto:support@leadsapp.com?subject=App Support Request')
  const handleCall = () => Linking.openURL('tel:+1234567890')

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.back}>
          <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.2)} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>How can we help you?</Text>
          <View style={{marginTop: responsiveHeight(1.5)}}>
            <CustomInput
              icon="search"
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQ_DATA.filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, index) => (
            <CollapsibleItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
            <MaterialCommunityIcons name="email-outline" size={responsiveFontSize(2.5)} color={Colors.primary} />
            <Text style={styles.contactText}>Email Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
            <MaterialCommunityIcons name="phone-outline" size={responsiveFontSize(2.5)} color={Colors.primary} />
            <Text style={styles.contactText}>Call Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default HelpSupport

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
  introCard: { backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(4), marginBottom: responsiveHeight(2), elevation: 1 },
  introTitle: { fontSize: responsiveFontSize(2), fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  section: { backgroundColor: Colors.white, borderRadius: 12, padding: responsiveWidth(4), marginBottom: responsiveHeight(2), elevation: 1 },
  sectionTitle: { fontSize: responsiveFontSize(1.8), fontWeight: '700', color: Colors.textPrimary, marginBottom: responsiveHeight(1.5) },
  faqItem: { borderBottomWidth: 1, borderBottomColor: Colors.primaryWithExtraOpacity, paddingVertical: responsiveHeight(1.5) },
  faqQuestionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: responsiveFontSize(1.6), color: Colors.textPrimary, fontWeight: '600', marginRight: responsiveWidth(2) },
  faqAnswerContainer: { marginTop: responsiveHeight(1), paddingLeft: responsiveWidth(2) },
  faqAnswer: { fontSize: responsiveFontSize(1.5), color: Colors.textSecondary, lineHeight: responsiveHeight(2.2) },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryWithExtraOpacity,
  },
  contactText: { marginLeft: responsiveWidth(4), fontSize: responsiveFontSize(1.6), color: Colors.textPrimary },
})