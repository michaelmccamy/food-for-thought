import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../../utils/firebase';
import { getGoals, saveGoals, UserGoals } from '../../utils/storage';

export default function ProfileScreen() {
	const [calories, setCalories] = useState('2000');
	const [protein, setProtein] = useState('150');
	const [carbs, setCarbs] = useState('200');
	const [fat, setFat] = useState('65');
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		loadGoals();
	}, []);

	const loadGoals = async () => {
		const goals = await getGoals();
		if (goals) {
			setCalories(goals.calories.toString());
			setProtein(goals.protein.toString());
			setCarbs(goals.carbs.toString());
			setFat(goals.fat.toString());
		}
	};

	const handleSave = async () => {
		const goals: UserGoals = {
			calories: parseInt(calories),
			protein: parseInt(protein),
			carbs: parseInt(carbs),
			fat: parseInt(fat),
		};
		await saveGoals(goals);
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	const handleLogout = async () => {
		await signOut(auth);
		router.replace('../login');
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>Profile</Text>
			<Text style={styles.email}>{auth.currentUser?.email}</Text>

			<Text style={styles.sectionTitle}>Daily Goals</Text>

			<Text style={styles.label}>Calories</Text>
			<TextInput
				style={styles.input}
				value={calories}
				onChangeText={setCalories}
				keyboardType="numeric"
				placeholderTextColor="#888"
			/>

			<Text style={styles.label}>Protein (g)</Text>
			<TextInput
				style={styles.input}
				value={protein}
				onChangeText={setProtein}
				keyboardType="numeric"
				placeholderTextColor="#888"
			/>

			<Text style={styles.label}>Carbs (g)</Text>
			<TextInput
				style={styles.input}
				value={carbs}
				onChangeText={setCarbs}
				keyboardType="numeric"
				placeholderTextColor="#888"
			/>

			<Text style={styles.label}>Fat (g)</Text>
			<TextInput
				style={styles.input}
				value={fat}
				onChangeText={setFat}
				keyboardType="numeric"
				placeholderTextColor="#888"
			/>

			<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
				<Text style={styles.saveButtonText}>{saved ? 'Saved!' : 'Save Goals'}</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
				<Text style={styles.logoutButtonText}>Log Out</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0f0f0f',
		padding: 24,
		paddingTop: 60,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#ffffff',
		marginBottom: 4,
	},
	email: {
		fontSize: 14,
		color: '#888888',
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#ffffff',
		marginBottom: 16,
	},
	label: {
		color: '#888888',
		fontSize: 12,
		fontWeight: '600',
		letterSpacing: 1,
		marginBottom: 8,
		textTransform: 'uppercase',
	},
	input: {
		backgroundColor: '#1a1a1a',
		borderRadius: 12,
		padding: 16,
		color: '#ffffff',
		fontSize: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#333333',
	},
	saveButton: {
		backgroundColor: '#22c55e',
		padding: 16,
		borderRadius: 50,
		alignItems: 'center',
		marginTop: 8,
		marginBottom: 12,
	},
	saveButtonText: {
		color: '#000000',
		fontSize: 16,
		fontWeight: 'bold',
	},
	logoutButton: {
		backgroundColor: '#1a1a1a',
		padding: 16,
		borderRadius: 50,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#333333',
		marginBottom: 40,
	},
	logoutButtonText: {
		color: '#ef4444',
		fontSize: 16,
		fontWeight: 'bold',
	},
});