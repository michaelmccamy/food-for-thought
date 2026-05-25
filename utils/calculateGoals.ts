export type UserProfile = {
	age: number;
	gender: 'male' | 'female';
	heightCm: number;
	weightKg: number;
	gymDays: number;
	dailyActivity: 'desk' | 'moderate' | 'physical';
	goal: 'lose' | 'maintain' | 'gain';
    units: 'metric' | 'imperial';
};

export type Goals = {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
};

export const lbsToKg = (lbs: number): number => {
	return Math.round(lbs * 0.453592 * 10) / 10;
};

export const feetInchesToCm = (feet: number, inches: number): number => {
	return Math.round((feet * 30.48) + (inches * 2.54));
};

const getActivityMultiplier = (gymDays: number, dailyActivity: string): number => {
	let base = 0;

	if (dailyActivity === 'desk') {
		base = 1.2;
	} else if (dailyActivity === 'moderate') {
		base = 1.4;
	} else {
		base = 1.6;
	}

	if (gymDays <= 1) {
		return base;
	} else if (gymDays <= 3) {
		return base + 0.1;
	} else if (gymDays <= 5) {
		return base + 0.2;
	} else {
		return base + 0.3;
	}
};

export const calculateGoals = (profile: UserProfile): Goals => {
	// BMR using Mifflin-St Jeor
	let bmr = 0;

	if (profile.gender === 'male') {
		bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
	} else {
		bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;
	}

	// TDEE using combined activity multiplier
	const multiplier = getActivityMultiplier(profile.gymDays, profile.dailyActivity);
	let calories = Math.round(bmr * multiplier);

	// adjust for goal
	if (profile.goal === 'lose') {
		calories -= 500;
	} else if (profile.goal === 'gain') {
		calories += 300;
	}

	// macros based on goal
	let protein = 0;
	let fat = 0;
	let carbs = 0;

	if (profile.goal === 'lose') {
		protein = Math.round(profile.weightKg * 2.2);
		fat = Math.round((calories * 0.25) / 9);
		carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
	} else if (profile.goal === 'gain') {
		protein = Math.round(profile.weightKg * 2.4);
		fat = Math.round((calories * 0.25) / 9);
		carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
	} else {
		protein = Math.round(profile.weightKg * 1.8);
		fat = Math.round((calories * 0.3) / 9);
		carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
	}

	return { calories, protein, carbs, fat };
};