/**
 * Simple App Entry for AstroCRM
 * Connected to Django Backend API
 */
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import axios from 'axios';

// API Base URL - Use your computer's IP for real device
// For Android Emulator use: 10.0.2.2
// For physical device: use your computer's local IP (e.g., 192.168.29.35)
const API_BASE = 'http://192.168.29.35:8000/api';

// Colors
const colors = {
    background: '#0D0B1E',
    surface: '#1A1730',
    primary: '#FF6B35',
    secondary: '#7C3AED',
    text: '#FFFFFF',
    textMuted: '#9CA3AF',
    glass: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    warning: '#F59E0B',
};

export default function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [devOtp, setDevOtp] = useState(''); // To show OTP in dev mode
    const [step, setStep] = useState<'phone' | 'otp' | 'home'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async () => {
        if (phoneNumber.length < 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE}/accounts/auth/send-otp/`, {
                phone_number: phoneNumber,
            });

            // In dev mode, OTP is returned in response
            if (response.data.otp) {
                setDevOtp(response.data.otp);
            }

            setStep('otp');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to send OTP. Is backend running?';
            setError(message);
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE}/accounts/auth/verify-otp/`, {
                phone_number: phoneNumber,
                otp: otp,
            });

            // Store tokens (in real app, use secure storage)
            console.log('Logged in!', response.data);
            Alert.alert('Success', `Welcome! ${response.data.is_new_user ? 'Account created!' : 'Logged in!'}`);
            setStep('home');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Invalid OTP. Please try again.';
            setError(message);
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    // Phone Input Screen
    if (step === 'phone') {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logo}>
                            <Text style={styles.logoText}>✦</Text>
                        </View>
                        <Text style={styles.title}>AstroCRM</Text>
                        <Text style={styles.subtitle}>Connect with Expert Astrologers</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Login / Sign Up</Text>
                        <Text style={styles.cardSubtitle}>
                            Enter your phone number to continue
                        </Text>

                        {/* Phone Input */}
                        <View style={styles.inputRow}>
                            <View style={styles.countryCode}>
                                <Text style={styles.countryCodeText}>+91</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>

                        {/* Button */}
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSendOTP}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Decorative Stars */}
                    <Text style={[styles.star, { top: 80, left: 30 }]}>✦</Text>
                    <Text style={[styles.star, { top: 120, right: 50 }]}>✧</Text>
                    <Text style={[styles.star, { top: 200, left: '40%' }]}>✦</Text>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // OTP Screen
    if (step === 'otp') {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Verify OTP</Text>
                        <Text style={styles.cardSubtitle}>
                            Enter the 6-digit code sent to +91 {phoneNumber}
                        </Text>

                        {/* Show OTP in dev mode */}
                        {devOtp ? (
                            <View style={styles.devHint}>
                                <Text style={styles.devHintText}>Dev OTP: {devOtp}</Text>
                            </View>
                        ) : null}

                        <TextInput
                            style={[styles.input, styles.otpInput]}
                            placeholder="Enter OTP"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                        />

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleVerifyOTP}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setStep('phone')}>
                            <Text style={styles.link}>← Change Phone Number</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // Home Screen (after login)
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>✦</Text>
                    </View>
                    <Text style={styles.title}>Welcome to AstroCRM!</Text>
                    <Text style={styles.cardSubtitle}>
                        You're logged in with +91 {phoneNumber}
                    </Text>

                    <View style={styles.featureList}>
                        <Text style={styles.featureItem}>🌟 Browse 500+ Astrologers</Text>
                        <Text style={styles.featureItem}>💬 Chat Consultations</Text>
                        <Text style={styles.featureItem}>📊 Free Kundli Reports</Text>
                        <Text style={styles.featureItem}>🔮 Daily Horoscope</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.buttonSecondary}
                        onPress={() => {
                            setPhoneNumber('');
                            setOtp('');
                            setStep('phone');
                        }}
                    >
                        <Text style={styles.buttonTextSecondary}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    logoText: {
        fontSize: 40,
        color: colors.text,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
    },
    card: {
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        borderRadius: 24,
        padding: 24,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 24,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    countryCode: {
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        borderRightWidth: 0,
    },
    countryCodeText: {
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '500',
    },
    input: {
        flex: 1,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 18,
        color: colors.text,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        letterSpacing: 2,
    },
    otpInput: {
        borderRadius: 12,
        textAlign: 'center',
        marginBottom: 16,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    buttonSecondary: {
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonTextSecondary: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textMuted,
    },
    link: {
        color: colors.textMuted,
        textAlign: 'center',
        fontSize: 14,
    },
    star: {
        position: 'absolute',
        fontSize: 16,
        color: colors.secondary,
        opacity: 0.6,
    },
    featureList: {
        marginVertical: 24,
    },
    featureItem: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 12,
    },
    devHint: {
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.4)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    devHintText: {
        color: colors.warning,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
