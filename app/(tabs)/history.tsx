import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getMealsByDay, Meal } from '../../utils/storage';

type DayGroup = {
	date: string;
	meals: Meal[];
	totals: {
		calories: number;
		protein: number;
		carbs: number;
		fat: number;
	};
};

export default function HistoryScreen() {
	const [days, setDays] = useState<DayGroup[]>([]);
	const [expanded, setExpanded] = useState<string | null>('today');

	useFocusEffect(
		useCallback(() => {
			loadHistory();
		}, [])
	);

	const loadHistory = async () => {
	const grouped = await getMealsByDay();
	const last7 = grouped.slice(0, 7);
	setDays(last7);

	if (last7.length > 0) {
		setExpanded(last7[0].date);
	}
};

	const toggleDay = (date: string) => {
		if (expanded === date) {
			setExpanded(null);
		} else {
			setExpanded(date);
		}
	};

	const formatDate = (dateKey: string) => {
		const [year, month, day] = dateKey.split('-').map(Number);
		const date = new Date(year, month, day);
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);

		if (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth()
		) {
			return 'Today';
		}

		if (
			date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth()
		) {
			return 'Yesterday';
		}

		return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>History</Text>

			{days.length === 0 && (
				<Text style={styles.empty}>No meals logged yet. Go scan something!</Text>
			)}

			{days.map((day) => (
				<View key={day.date} style={[
          styles.dayCard,
          day.date === days[0]?.date && styles.todayCard
        ]}>
					<TouchableOpacity onPress={() => toggleDay(day.date)} style={styles.dayHeader}>
						<View>
							<Text style={styles.dayDate}>{formatDate(day.date)}</Text>
							<Text style={styles.dayCalories}>{day.totals.calories} kcal</Text>
						</View>
						<View style={styles.dayMacros}>
							<Text style={styles.macroText}>P: {day.totals.protein}g</Text>
							<Text style={styles.macroText}>C: {day.totals.carbs}g</Text>
							<Text style={styles.macroText}>F: {day.totals.fat}g</Text>
							<Text style={styles.chevron}>{expanded === day.date ? '▲' : '▼'}</Text>
						</View>
					</TouchableOpacity>

					{expanded === day.date && (
						<View style={styles.mealsContainer}>
							{day.meals.map((meal) => (
								<View key={meal.id} style={styles.mealRow}>
									<View>
										<Text style={styles.mealName}>{meal.foods[0].name}</Text>
										<Text style={styles.mealTime}>
											{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</Text>
									</View>
									<Text style={styles.mealCalories}>{meal.totals.calories} kcal</Text>
								</View>
							))}
						</View>
					)}
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
	dayCard: {
		backgroundColor: '#1a1a1a',
		borderRadius: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#333333',
		overflow: 'hidden',
	},
  todayCard: {
    borderColor: '#22c55e',
    borderWidth: 1.5,
  },
	dayHeader: {
		padding: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dayDate: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 2,
	},
	dayCalories: {
		color: '#22c55e',
		fontSize: 13,
	},
	dayMacros: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	macroText: {
		color: '#888888',
		fontSize: 12,
	},
	chevron: {
		color: '#888888',
		fontSize: 10,
		marginLeft: 4,
	},
	mealsContainer: {
		borderTopWidth: 1,
		borderTopColor: '#333333',
		padding: 12,
	},
	mealRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#222222',
	},
	mealName: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '500',
	},
	mealTime: {
		color: '#888888',
		fontSize: 12,
		marginTop: 2,
	},
	mealCalories: {
		color: '#22c55e',
		fontSize: 14,
		fontWeight: 'bold',
	},
});