import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { auth } from '../utils/firebase';

export default function LoginScreen() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		try {
			if (isSignUp) {
				await createUserWithEmailAndPassword(auth, email, password);
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
			router.replace('/(tabs)');
		} catch (e: any) {
			setError(e.message);
		}
	};

	return (
		<SafeAreaView style={s.safe}>
			<KeyboardAvoidingView
				style={s.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<View style={s.container}>

					<View style={s.iconBox}>
						<Text style={s.iconEmoji}>🥗</Text>
					</View>

					<Text style={s.title}>Food For Thought</Text>
					<Text style={s.subtitle}>
						{isSignUp ? 'Create an account to get started' : 'Log in to track your meals'}
					</Text>

					<Text style={s.label}>EMAIL</Text>
					<TextInput
						style={s.input}
						placeholder="you@example.com"
						placeholderTextColor="#444"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>

					<Text style={s.label}>PASSWORD</Text>
					<View style={s.inputRow}>
						<TextInput
							style={[s.input, s.inputFlex]}
							placeholder="••••••••"
							placeholderTextColor="#444"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!showPassword}
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={s.eyeBtn}
							onPress={() => setShowPassword(v => !v)}
						>
							<Text style={s.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
						</TouchableOpacity>
					</View>

					{!isSignUp && (
						<TouchableOpacity style={s.forgotWrap}
							onPress={() => alert('Password reset not implemented yet')}>
							<Text style={s.forgot}>Forgot password?</Text>
						</TouchableOpacity>
					)}

					{error ? <Text style={{ color: '#ef4444', marginBottom: 12, textAlign: 'center' }}>{error}</Text> : null}

					<TouchableOpacity
						style={s.btnGreen}
						onPress={handleSubmit}
					>
						<Text style={s.btnGreenText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
					</TouchableOpacity>

					<View style={s.divider}>
						<View style={s.divLine} />
						<Text style={s.divText}>or continue with</Text>
						<View style={s.divLine} />
					</View>

					<TouchableOpacity
						style={s.btnGhost}
						onPress={() => alert('Google Sign-In not implemented yet')}
					>
						<Text style={s.btnGhostText}>🇬  Continue with Google</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={s.switchRow}
						onPress={() => setIsSignUp(v => !v)}
					>
						<Text style={s.switchText}>
							{isSignUp ? 'Already have an account? ' : "Don't have an account? "}
							<Text style={s.switchLink}>{isSignUp ? 'Sign in' : 'Sign up'}</Text>
						</Text>
					</TouchableOpacity>

				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const GREEN = '#4a9e5c';
const BG = '#0e0e0e';
const SURFACE = '#1a1a1a';
const BORDER = '#2a2a2a';

const s = StyleSheet.create({
	safe: { flex: 1, backgroundColor: BG },
	flex: { flex: 1 },
	container: {
		flex: 1,
		paddingHorizontal: 28,
		paddingTop: 32,
		paddingBottom: 24,
	},
	iconBox: {
		width: 54,
		height: 54,
		backgroundColor: '#1c2e1c',
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 28,
	},
	iconEmoji: { fontSize: 26 },
	title: {
		color: '#ffffff',
		fontSize: 34,
		fontWeight: '900',
		letterSpacing: -0.5,
		lineHeight: 38,
		marginBottom: 8,
	},
	subtitle: {
		color: '#6b6b6b',
		fontSize: 15,
		fontWeight: '500',
		marginBottom: 36,
	},
	label: {
		color: '#555',
		fontSize: 11,
		fontWeight: '600',
		letterSpacing: 1,
		marginBottom: 8,
	},
	input: {
		backgroundColor: SURFACE,
		borderWidth: 1.5,
		borderColor: BORDER,
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 14,
		color: '#ffffff',
		fontSize: 15,
		marginBottom: 16,
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	inputFlex: { flex: 1, marginBottom: 0 },
	eyeBtn: { position: 'absolute', right: 14, padding: 4 },
	eyeText: { fontSize: 16 },
	forgotWrap: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 24 },
	forgot: { color: GREEN, fontSize: 13, fontWeight: '600' },
	btnGreen: {
		backgroundColor: GREEN,
		borderRadius: 100,
		paddingVertical: 17,
		alignItems: 'center',
		marginBottom: 20,
	},
	btnGreenText: { color: BG, fontSize: 16, fontWeight: '700' },
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	divLine: { flex: 1, height: 1, backgroundColor: '#222' },
	divText: { color: '#444', fontSize: 13, fontWeight: '500', marginHorizontal: 10 },
	btnGhost: {
		backgroundColor: SURFACE,
		borderWidth: 1.5,
		borderColor: BORDER,
		borderRadius: 100,
		paddingVertical: 15,
		alignItems: 'center',
		marginBottom: 14,
	},
	btnGhostText: { color: '#cccccc', fontSize: 15, fontWeight: '600' },
	switchRow: { alignItems: 'center', marginTop: 24 },
	switchText: { color: '#555', fontSize: 13, fontWeight: '500' },
	switchLink: { color: GREEN, fontWeight: '700' },
});