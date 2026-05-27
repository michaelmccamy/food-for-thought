import { GoogleGenerativeAI } from '@google/generative-ai';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getGoals, getTodaysMeals, Meal, saveMeal } from '../../utils/storage';

const { GEMINI_API_KEY } = require('../../secret.json');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function HomeScreen() {
  const [result, setResult] = useState<{Food: string, Calories: number, Protein: number, Carbs: number, Fat: number} | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 200, fat: 65 });
  const [loading, setLoading] = useState(false);
  const [todayTotals, setTodayTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Camera permission is required!');
      return;
    }
    const photo = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });
    if (!photo.canceled && photo.assets[0].base64) {
      setImage(photo.assets[0].uri);
      analyzeFood(photo.assets[0].base64);
    }
  };

  const analyzeFood = async (base64Image: string) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        'Identify the food in this image and estimate the macros. Respond with ONLY a JSON object in this exact format, no other text: {"Food": "food name", "Calories": 000, "Protein": 00, "Carbs": 00, "Fat": 00}',
      ]);
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
    } catch (e) {
      alert(String(e));
    } finally {
      setLoading(false);
    }
  };


  const logMeal = async () => {
    if (!result) return;
    const meal: Meal = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      foods: [{ name: result.Food, portion: '', calories: result.Calories, protein: result.Protein, carbs: result.Carbs, fat: result.Fat }],
      totals: { calories: result.Calories, protein: result.Protein, carbs: result.Carbs, fat: result.Fat },
    };
    await saveMeal(meal);
    await loadTodayData();
    setResult(null);
    setImage(null);
  };

  useEffect(() => {
		loadTodayData();
	}, []);

	const loadTodayData = async () => {
		const meals = await getTodaysMeals();
		const g = await getGoals();

		if (g) setGoals(g);

		let calories = 0, protein = 0, carbs = 0, fat = 0;
		for (const meal of meals) {
			calories += meal.totals.calories;
			protein += meal.totals.protein;
			carbs += meal.totals.carbs;
			fat += meal.totals.fat;
		}
		setTodayTotals({ calories, protein, carbs, fat });
	};

return (
	<ScrollView style={styles.container} contentContainerStyle={styles.content}>
		<Text style={styles.title}>Food For Thought</Text>
		<Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>

		<View style={styles.ringsRow}>
			{[
				{ label: 'Calories', value: todayTotals.calories, goal: goals.calories, color: '#22c55e' },
				{ label: 'Protein', value: todayTotals.protein, goal: goals.protein, color: '#3b82f6' },
				{ label: 'Carbs', value: todayTotals.carbs, goal: goals.carbs, color: '#f59e0b' },
				{ label: 'Fat', value: todayTotals.fat, goal: goals.fat, color: '#ec4899' },
			].map((macro) => {
				const pct = Math.min(macro.value / macro.goal, 1);
				const circumference = 175.93;
				const offset = circumference - pct * circumference;
				return (
					<View key={macro.label} style={styles.ringWrapper}>
						<View style={styles.ringContainer}>
							<Svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: [{ rotate: '-90deg' }] }}>
								<Circle cx="36" cy="36" r="28" fill="none" stroke="#1a1a1a" strokeWidth="6" />
								<Circle cx="36" cy="36" r="28" fill="none" stroke={macro.color} strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
							</Svg>
							<Text style={styles.ringPct}>{Math.round(pct * 100)}%</Text>
						</View>
						<Text style={styles.ringLabel}>{macro.label}</Text>
						<Text style={styles.ringValue}>{macro.value}{macro.label !== 'Calories' ? 'g' : ''}</Text>
					</View>
				);
			})}
		</View>

		<View style={styles.cameraBox}>
			{image ? (
				<Image source={{ uri: image }} style={styles.photo} />
			) : (
				<Text style={styles.cameraPlaceholder}>Snap your meal</Text>
			)}
		</View>

		<TouchableOpacity style={styles.button} onPress={takePhoto}>
			<Text style={styles.buttonText}>Take Photo</Text>
		</TouchableOpacity>
		<Text style={styles.instructions}>Photo will be analyzed for macros</Text>

		{loading && <Text style={styles.loading}>Analyzing your meal...</Text>}

		{result && (
			<View style={styles.card}>
				<Text style={styles.foodName}>{result.Food}</Text>
				<View style={styles.macroRow}>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{result.Calories}</Text>
						<Text style={styles.macroLabel}>Calories</Text>
					</View>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{result.Protein}g</Text>
						<Text style={styles.macroLabel}>Protein</Text>
					</View>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{result.Carbs}g</Text>
						<Text style={styles.macroLabel}>Carbs</Text>
					</View>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{result.Fat}g</Text>
						<Text style={styles.macroLabel}>Fat</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.logButton} onPress={logMeal}>
					<Text style={styles.logButtonText}>Log this meal</Text>
				</TouchableOpacity>
			</View>
		)}
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
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#ffffff',
		marginBottom: 4,
	},
	date: {
		fontSize: 13,
		color: '#555555',
		marginBottom: 24,
	},
	ringsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	ringWrapper: {
		alignItems: 'center',
		gap: 4,
	},
	ringContainer: {
		width: 72,
		height: 72,
		alignItems: 'center',
		justifyContent: 'center',
	},
	ringPct: {
		position: 'absolute',
		color: '#ffffff',
		fontSize: 10,
		fontWeight: 'bold',
	},
	ringLabel: {
		color: '#888888',
		fontSize: 10,
	},
	ringValue: {
		color: '#ffffff',
		fontSize: 11,
		fontWeight: 'bold',
	},
	cameraBox: {
		backgroundColor: '#1a1a1a',
		borderRadius: 16,
		height: 180,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#333333',
		borderStyle: 'dashed',
		marginBottom: 16,
		overflow: 'hidden',
	},
	cameraPlaceholder: {
		color: '#555555',
		fontSize: 14,
	},
	photo: {
		width: '100%',
		height: '100%',
	},
	button: {
		backgroundColor: '#22c55e',
		paddingVertical: 16,
		paddingHorizontal: 40,
		borderRadius: 50,
		alignItems: 'center',
		marginBottom: 10,
	},
	buttonText: {
		color: '#000000',
		fontSize: 18,
		fontWeight: 'bold',
	},
	instructions: {
		color: '#555555',
		fontSize: 12,
		textAlign: 'center',
		marginBottom: 24,
	},
	loading: {
		color: '#888888',
		textAlign: 'center',
		marginBottom: 16,
	},
	card: {
		backgroundColor: '#1a1a1a',
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: '#333333',
	},
	foodName: {
		color: '#ffffff',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	macroRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	macroBox: {
		alignItems: 'center',
		backgroundColor: '#222222',
		borderRadius: 12,
		padding: 12,
		width: '23%',
	},
	macroValue: {
		color: '#22c55e',
		fontSize: 18,
		fontWeight: 'bold',
	},
	macroLabel: {
		color: '#888888',
		fontSize: 11,
		marginTop: 4,
	},
	logButton: {
		backgroundColor: '#3b82f6',
		paddingVertical: 14,
		borderRadius: 50,
		alignItems: 'center',
	},
	logButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});