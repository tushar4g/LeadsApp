import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import RenderHTML from 'react-native-render-html'
import Colors from '../../../style/Colors'

const privacyPolicyHtml = `
  <h1>Privacy Policy for LeadsApp</h1>
  <p><strong>Last updated: November 12, 2025</strong></p>
  <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
  
  <h2>1. Information We Collect</h2>
  <p>We may collect several types of information from and about users of our App, including:</p>
  <ul>
      <li><strong>Personal Information:</strong> such as name, email address, phone number that you provide to us.</li>
      <li><strong>Usage Data:</strong> information on how the App is accessed and used (e.g., features used, time spent on pages).</li>
      <li><strong>Device Information:</strong> information about your mobile device and internet connection, including the device's unique identifier, IP address, operating system, and browser type.</li>
  </ul>
  
  <h2>2. How We Use Your Information</h2>
  <p>We use the information that we collect about you or that you provide to us, including any personal information, for the following purposes:</p>
  <ul>
      <li>To provide and maintain our App and its contents to you.</li>
      <li>To notify you about changes to our App or any products or services we offer.</li>
      <li>To allow you to participate in interactive features on our App.</li>
      <li>To provide customer support and respond to your inquiries.</li>
      <li>For any other purpose with your consent.</li>
  </ul>
  
  <h2>3. Data Security</h2>
  <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. The safety and security of your information also depends on you.</p>
  
  <h2>4. Changes to Our Privacy Policy</h2>
  <p>It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the App's home screen.</p>
  
  <h2>5. Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, You can contact us by email at: <strong>support@leadsapp.com</strong></p>
`

const PrivacyPolicy = ({ navigation }) => {
  const { width } = useWindowDimensions()

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
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <RenderHTML
          contentWidth={width - responsiveWidth(8)}
          source={{ html: privacyPolicyHtml }}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
    </View>
  )
}

export default PrivacyPolicy

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
    padding: responsiveWidth(4),
    backgroundColor: Colors.white,
  },
})

const tagsStyles = {
  h1: {
    fontSize: responsiveFontSize(2.5),
    color: Colors.textPrimary,
    marginBottom: responsiveHeight(1),
    borderBottomWidth: 1,
    borderColor: Colors.primaryWithExtraOpacity,
    paddingBottom: responsiveHeight(1),
  },
  h2: {
    fontSize: responsiveFontSize(2),
    color: Colors.textPrimary,
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1),
  },
  p: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textSecondary,
    lineHeight: responsiveHeight(2.5),
    marginBottom: responsiveHeight(1),
  },
  ul: {
    marginLeft: responsiveWidth(4),
  },
  li: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textSecondary,
    lineHeight: responsiveHeight(2.5),
    marginBottom: responsiveHeight(0.5),
  },
  strong: {
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
}