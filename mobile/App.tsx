import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    SafeAreaView, KeyboardAvoidingView, Platform, Alert,
    ActivityIndicator, Keyboard
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics'; // PREMIUM FEEL

// REPLACE WITH YOUR PC IP
const API_BASE = 'http://192.168.29.35:8000/api';

const theme = {
    colors: {
        background: '#0D0B1E',
        surface: 'rgba(255, 255, 255, 0.1)',
        primary: ['#FF6B35', '#FF3366'] as const,
        text: '#FFFFFF',
        textMuted: '#9CA3AF',
    }
};

export default function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp' | 'home'>('phone');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        // Tactile feedback
        Haptics.selectionAsync();
        Keyboard.dismiss();

        if (phoneNumber.length < 10) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit number');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/accounts/auth/send-otp/`, { phone_number: phoneNumber });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // For dev purposes, show OTP in alert if returned
            if (res.data.otp) Alert.alert("Dev OTP", String(res.data.otp));

            setStep('otp');
        } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Could not connect. Ensure Backend is running and IP is correct.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        Haptics.selectionAsync();
        Keyboard.dismiss();
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/accounts/auth/verify-otp/`, { phone_number: phoneNumber, otp });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStep('home');
        } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // Reusable Button Component
    const GradientButton = ({ onPress, title, disabled }: any) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={styles.buttonContainer}
        >
            <LinearGradient
                colors={disabled ? ['#4B5563', '#374151'] : theme.colors.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                {loading ? <ActivityIndicator color="white" /> : (
                    <Text style={styles.buttonText}>{title}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#0D0B1E', '#1A1730', '#251F47']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    {/* Header/Logo */}
                    <View style={styles.header}>
                        <View style={styles.logoBox}>
                            <Text style={styles.logoIcon}>✦</Text>
                        </View>
                        <Text style={styles.logoText}>AstroCRM</Text>
                    </View>

                    {/* Glass Card */}
                    <BlurView intensity={30} tint="dark" style={styles.card}>
                        {step === 'phone' && (
                            <>
                                <Text style={styles.title}>Login</Text>
                                <Text style={styles.subtitle}>Enter your mobile number</Text>
                                <View style={styles.inputRow}>
                                    <View style={styles.countryCode}>
                                        <Text style={styles.text}>+91</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone Number"
                                        placeholderTextColor={theme.colors.textMuted}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        cursorColor="#FF6B35"
                                    />
                                </View>
                                <GradientButton
                                    title="Get OTP"
                                    onPress={handleSendOTP}
                                    disabled={loading}
                                />
                            </>
                        )}

                        {step === 'otp' && (
                            <>
                                <Text style={styles.title}>Verify OTP</Text>
                                <Text style={styles.subtitle}>Sent to +91 {phoneNumber}</Text>
                                <TextInput
                                    style={[styles.input, styles.otpInput]}
                                    placeholder="• • • • • •"
                                    placeholderTextColor={theme.colors.textMuted}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    value={otp}
                                    onChangeText={setOtp}
                                    autoFocus
                                    cursorColor="#FF6B35"
                                />
                                <GradientButton
                                    title="Verify"
                                    onPress={handleVerifyOTP}
                                    disabled={loading}
                                />
                                <TouchableOpacity onPress={() => setStep('phone')} style={styles.linkButton}>
                                    <Text style={styles.linkText}>Change Number</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {step === 'home' && (
                            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                                <Text style={[styles.title, { marginBottom: 10 }]}>Welcome!</Text>
                                <Text style={styles.subtitle}>You are now connected.</Text>
                                <View style={styles.successIcon}>
                                    <Text style={{ fontSize: 40 }}>✨</Text>
                                </View>
                                <TouchableOpacity onPress={() => setStep('phone')} style={styles.linkButton}>
                                    <Text style={[styles.linkText, { color: '#EF4444' }]}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </BlurView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    safeArea: { flex: 1 },
    content: { flex: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoBox: {
        width: 60, height: 60, backgroundColor: '#FF6B35', borderRadius: 18,
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
        shadowColor: '#FF6B35', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
    },
    logoIcon: { fontSize: 30, color: 'white' },
    logoText: { fontSize: 28, fontWeight: 'bold', color: 'white', letterSpacing: 1 },
    card: {
        borderRadius: 24, padding: 32, overflow: 'hidden',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
    },
    title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 8 },
    subtitle: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 24 },
    inputRow: { flexDirection: 'row', marginBottom: 24, height: 56 },
    countryCode: {
        backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 16, justifyContent: 'center',
        borderTopLeftRadius: 12, borderBottomLeftRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
    },
    input: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 16, fontSize: 18,
        color: 'white', borderTopRightRadius: 12, borderBottomRightRadius: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderLeftWidth: 0
    },
    otpInput: { borderRadius: 12, textAlign: 'center', letterSpacing: 8, marginBottom: 24, borderLeftWidth: 1 },
    buttonContainer: { borderRadius: 12, overflow: 'hidden', elevation: 5, shadowColor: '#FF6B35', shadowOpacity: 0.3 },
    button: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    text: { color: 'white', fontSize: 16 },
    linkButton: { marginTop: 20, alignItems: 'center' },
    linkText: { color: theme.colors.textMuted },
    successIcon: { marginVertical: 30, transform: [{ scale: 1.5 }] }
});