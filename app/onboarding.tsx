import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { calculateGoals, feetInchesToCm, lbsToKg, UserProfile } from '../utils/calculateGoals';
import { saveGoals, saveProfile } from '../utils/storage';

export default function OnboardingScreen() {
	const [step, setStep] = useState(1);
	const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');
	const [gender, setGender] = useState<'male' | 'female' | null>(null);
	const [age, setAge] = useState('');
	const [weightLbs, setWeightLbs] = useState('');
	const [weightKg, setWeightKg] = useState('');
	const [heightFeet, setHeightFeet] = useState('');
	const [heightInches, setHeightInches] = useState('');
	const [heightCm, setHeightCm] = useState('');
	const [gymDays, setGymDays] = useState<number | null>(null);
	const [dailyActivity, setDailyActivity] = useState<'desk' | 'moderate' | 'physical' | null>(null);
	const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain' | null>(null);

	const totalSteps = 7;

	const next = () => setStep(s => s + 1);
	const back = () => setStep(s => s - 1);

	const handleFinish = async () => {
		let finalWeightKg = 0;
		let finalHeightCm = 0;

		if (units === 'imperial') {
			finalWeightKg = lbsToKg(parseFloat(weightLbs));
			finalHeightCm = feetInchesToCm(parseFloat(heightFeet), parseFloat(heightInches));
		} else {
			finalWeightKg = parseFloat(weightKg);
			finalHeightCm = parseFloat(heightCm);
		}

		const profile: UserProfile = {
			age: parseInt(age),
			gender: gender!,
			heightCm: finalHeightCm,
			weightKg: finalWeightKg,
			gymDays: gymDays!,
			dailyActivity: dailyActivity!,
			goal: goal!,
			units,
		};

		const goals = calculateGoals(profile);
		await saveProfile(profile);
		await saveGoals(goals);
		router.replace('/(tabs)');
	};

	const OptionButton = ({ label, value, selected, onPress }: any) => (
		<TouchableOpacity
			style={[styles.option, selected && styles.optionSelected]}
			onPress={onPress}
		>
			<Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
		</TouchableOpacity>
	);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>

			<View style={styles.progressBar}>
				<View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
			</View>
			<Text style={styles.stepText}>Step {step} of {totalSteps}</Text>

			{step === 1 && (
				<View>
					<Text style={styles.title}>Welcome! </Text>
					<Text style={styles.subtitle}>Let's set up your profile to calculate your personalized nutrition goals.</Text>
					<Text style={styles.question}>Which units do you prefer?</Text>
					<OptionButton label="Imperial (lbs, ft)" value="imperial" selected={units === 'imperial'} onPress={() => setUnits('imperial')} />
					<OptionButton label="Metric (kg, cm)" value="metric" selected={units === 'metric'} onPress={() => setUnits('metric')} />
				</View>
			)}

			{step === 2 && (
				<View>
					<Text style={styles.question}>What's your gender?</Text>
					<OptionButton label="Male" value="male" selected={gender === 'male'} onPress={() => setGender('male')} />
					<OptionButton label="Female" value="female" selected={gender === 'female'} onPress={() => setGender('female')} />
				</View>
			)}

			{step === 3 && (
				<View>
					<Text style={styles.question}>How old are you?</Text>
					<TextInput
						style={styles.input}
						value={age}
						onChangeText={setAge}
						keyboardType="numeric"
						placeholder="Age"
						placeholderTextColor="#888"
					/>
				</View>
			)}

			{step === 4 && (
				<View>
					<Text style={styles.question}>What's your weight?</Text>
					{units === 'imperial' ? (
						<TextInput
							style={styles.input}
							value={weightLbs}
							onChangeText={setWeightLbs}
							keyboardType="numeric"
							placeholder="Weight (lbs)"
							placeholderTextColor="#888"
						/>
					) : (
						<TextInput
							style={styles.input}
							value={weightKg}
							onChangeText={setWeightKg}
							keyboardType="numeric"
							placeholder="Weight (kg)"
							placeholderTextColor="#888"
						/>
					)}
				</View>
			)}

			{step === 5 && (
				<View>
					<Text style={styles.question}>What's your height?</Text>
					{units === 'imperial' ? (
						<View style={styles.row}>
							<TextInput
								style={[styles.input, styles.halfInput]}
								value={heightFeet}
								onChangeText={setHeightFeet}
								keyboardType="numeric"
								placeholder="Feet"
								placeholderTextColor="#888"
							/>
							<TextInput
								style={[styles.input, styles.halfInput]}
								value={heightInches}
								onChangeText={setHeightInches}
								keyboardType="numeric"
								placeholder="Inches"
								placeholderTextColor="#888"
							/>
						</View>
					) : (
						<TextInput
							style={styles.input}
							value={heightCm}
							onChangeText={setHeightCm}
							keyboardType="numeric"
							placeholder="Height (cm)"
							placeholderTextColor="#888"
						/>
					)}
				</View>
			)}

			{step === 6 && (
				<View>
					<Text style={styles.question}>How many days a week do you go to the gym?</Text>
					{[0, 1, 2, 3, 4, 5, 6].map(day => (
						<OptionButton
							key={day}
							label={day === 0 ? '0 — I don\'t go' : `${day} day${day > 1 ? 's' : ''}`}
							value={day}
							selected={gymDays === day}
							onPress={() => setGymDays(day)}
						/>
					))}
					<Text style={[styles.question, { marginTop: 24 }]}>How active is your daily life?</Text>
					<OptionButton label=" Desk job / mostly sitting" value="desk" selected={dailyActivity === 'desk'} onPress={() => setDailyActivity('desk')} />
					<OptionButton label=" Moderately active" value="moderate" selected={dailyActivity === 'moderate'} onPress={() => setDailyActivity('moderate')} />
					<OptionButton label=" Physical job / very active" value="physical" selected={dailyActivity === 'physical'} onPress={() => setDailyActivity('physical')} />
				</View>
			)}

			{step === 7 && (
				<View>
					<Text style={styles.question}>What's your main goal?</Text>
					<OptionButton label=" Lose weight" value="lose" selected={goal === 'lose'} onPress={() => setGoal('lose')} />
					<OptionButton label=" Maintain weight" value="maintain" selected={goal === 'maintain'} onPress={() => setGoal('maintain')} />
					<OptionButton label=" Build muscle" value="gain" selected={goal === 'gain'} onPress={() => setGoal('gain')} />
				</View>
			)}

			<View style={styles.buttons}>
				{step > 1 && (
					<TouchableOpacity style={styles.backButton} onPress={back}>
						<Text style={styles.backButtonText}>Back</Text>
					</TouchableOpacity>
				)}
				{step < totalSteps ? (
					<TouchableOpacity style={styles.nextButton} onPress={next}>
						<Text style={styles.nextButtonText}>Next</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
						<Text style={styles.nextButtonText}>Let's go!</Text>
					</TouchableOpacity>
				)}
			</View>

		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0f0f0f',
	},
	content: {
		padding: 24,
		paddingTop: 60,
		paddingBottom: 40,
	},
	progressBar: {
		height: 4,
		backgroundColor: '#222222',
		borderRadius: 2,
		marginBottom: 8,
	},
	progressFill: {
		height: 4,
		backgroundColor: '#22c55e',
		borderRadius: 2,
	},
	stepText: {
		color: '#888888',
		fontSize: 12,
		marginBottom: 32,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#ffffff',
		marginBottom: 8,
	},
	subtitle: {
		color: '#888888',
		fontSize: 15,
		marginBottom: 32,
	},
	question: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#ffffff',
		marginBottom: 20,
	},
	option: {
		backgroundColor: '#1a1a1a',
		borderRadius: 12,
		padding: 16,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#333333',
	},
	optionSelected: {
		borderColor: '#22c55e',
		backgroundColor: '#0f2a0f',
	},
	optionText: {
		color: '#888888',
		fontSize: 16,
	},
	optionTextSelected: {
		color: '#22c55e',
		fontWeight: 'bold',
	},
	input: {
		backgroundColor: '#1a1a1a',
		borderRadius: 12,
		padding: 16,
		color: '#ffffff',
		fontSize: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#333333',
	},
	row: {
		flexDirection: 'row',
		gap: 12,
	},
	halfInput: {
		flex: 1,
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 32,
		gap: 12,
	},
	nextButton: {
		flex: 1,
		backgroundColor: '#22c55e',
		padding: 16,
		borderRadius: 50,
		alignItems: 'center',
	},
	nextButtonText: {
		color: '#000000',
		fontSize: 16,
		fontWeight: 'bold',
	},
	backButton: {
		flex: 1,
		backgroundColor: '#1a1a1a',
		padding: 16,
		borderRadius: 50,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#333333',
	},
	backButtonText: {
		color: '#888888',
		fontSize: 16,
		fontWeight: 'bold',
	},
});