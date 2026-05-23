import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getTodaysMeals, Meal } from '../../utils/storage';

export default function HistoryScreen() {
	const [meals, setMeals] = useState<Meal[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
	useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

	const loadMeals = async () => {
    const todaysMeals = await getTodaysMeals();
    setMeals(todaysMeals);

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    for (const meal of todaysMeals) {
      calories += meal.totals.calories;
      protein += meal.totals.protein;
      carbs += meal.totals.carbs;
      fat += meal.totals.fat;
    }
    setTotals({ calories, protein, carbs, fat });
  };

	return (
	<ScrollView style={styles.container}>
		<Text style={styles.title}>Today's Meals</Text>
    <View style={styles.totalsCard}>
			<Text style={styles.totalsTitle}>Daily Total</Text>
			<View style={styles.macroRow}>
				<View style={styles.macroBox}>
					<Text style={styles.macroValue}>{totals.calories}</Text>
					<Text style={styles.macroLabel}>Calories</Text>
				</View>
				<View style={styles.macroBox}>
					<Text style={styles.macroValue}>{totals.protein}g</Text>
					<Text style={styles.macroLabel}>Protein</Text>
				</View>
				<View style={styles.macroBox}>
					<Text style={styles.macroValue}>{totals.carbs}g</Text>
					<Text style={styles.macroLabel}>Carbs</Text>
				</View>
				<View style={styles.macroBox}>
					<Text style={styles.macroValue}>{totals.fat}g</Text>
					<Text style={styles.macroLabel}>Fat</Text>
				</View>
			</View>
		</View>
		{meals.length === 0 && (
			<Text style={styles.empty}>No meals logged yet. Go scan something!</Text>
		)}

		{meals.map((meal) => (
			<View key={meal.id} style={styles.card}>
				<Text style={styles.mealName}>{meal.foods[0].name}</Text>
				<Text style={styles.mealTime}>
					{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				</Text>
				<View style={styles.macroRow}>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{meal.totals.calories}</Text>
						<Text style={styles.macroLabel}>Calories</Text>
					</View>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{meal.totals.protein}g</Text>
						<Text style={styles.macroLabel}>Protein</Text>
					</View>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{meal.totals.carbs}g</Text>
						<Text style={styles.macroLabel}>Carbs</Text>
					</View>
					<View style={styles.macroBox}>
						<Text style={styles.macroValue}>{meal.totals.fat}g</Text>
						<Text style={styles.macroLabel}>Fat</Text>
					</View>
				</View>
			</View>
		))}
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
		marginBottom: 24,
	},
  empty: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  mealName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealTime: {
    color: '#888888',
    fontSize: 13,
    marginBottom: 12,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroBox: {
    alignItems: 'center',
    backgroundColor: '#222222',
    borderRadius: 12,
    padding: 10,
    width: '23%',
  },
  macroValue: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  macroLabel: {
    color: '#888888',
    fontSize: 11,
    marginTop: 4,
  },
  totalsCard: {
	backgroundColor: '#1a1a1a',
	borderRadius: 16,
	padding: 20,
	marginBottom: 24,
	borderWidth: 1,
	borderColor: '#22c55e',
  },
  totalsTitle: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
}
);
