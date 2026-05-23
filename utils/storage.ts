import AsyncStorage from '@react-native-async-storage/async-storage';

export type Meal = {
  id: string;
  timestamp: number;
  foods: {
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export const saveMeal = async (meal: Meal) => {
    const existing = await AsyncStorage.getItem('meals');
    let meals: Meal[] = [];
  
    if (existing) {
        meals = JSON.parse(existing);
    }
  
    meals.push(meal);
    await AsyncStorage.setItem('meals', JSON.stringify(meals));
};

export const getMeals = async () => {
	const existing = await AsyncStorage.getItem('meals');
	let meals: Meal[] = [];

	if (existing) {
		meals = JSON.parse(existing);
	}
	return meals;
};

export const getTodaysMeals = async () => {
	const allMeals = await getMeals();
	const today = new Date();
	const todaysMeals: Meal[] = [];

	for (const meal of allMeals) {
		const mealDate = new Date(meal.timestamp);
		if (
			mealDate.getFullYear() === today.getFullYear() &&
			mealDate.getMonth() === today.getMonth() &&
			mealDate.getDate() === today.getDate()
		) {
			todaysMeals.push(meal);
		}
	}
	return todaysMeals;
};

export const deleteMeal = async (id: string) => {
	const allMeals = await getMeals();
	const updated: Meal[] = [];

	for (const meal of allMeals) {
		if (meal.id !== id) {
			updated.push(meal);
		}
	}
	await AsyncStorage.setItem('meals', JSON.stringify(updated));
};