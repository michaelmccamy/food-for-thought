import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

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

export type UserGoals = {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
};

export const saveMeal = async (meal: Omit<Meal, 'id'>): Promise<void> => {
	const user = auth.currentUser;
	if (!user) return;

	await addDoc(collection(db, 'users', user.uid, 'meals'), meal);
};

export const getMeals = async (): Promise<Meal[]> => {
	const user = auth.currentUser;
	if (!user) return [];

	const snapshot = await getDocs(collection(db, 'users', user.uid, 'meals'));
	const meals: Meal[] = [];

	for (const doc of snapshot.docs) {
		meals.push({ id: doc.id, ...doc.data() } as Meal);
	}

	return meals;
};

export const getTodaysMeals = async (): Promise<Meal[]> => {
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

export const deleteMeal = async (id: string): Promise<void> => {
	const user = auth.currentUser;
	if (!user) return;

	await deleteDoc(doc(db, 'users', user.uid, 'meals', id));
};

export const clearAllMeals = async (): Promise<void> => {
	const user = auth.currentUser;
	if (!user) return;

	const snapshot = await getDocs(collection(db, 'users', user.uid, 'meals'));
	for (const document of snapshot.docs) {
		await deleteDoc(doc(db, 'users', user.uid, 'meals', document.id));
	}
};

export const saveGoals = async (goals: UserGoals): Promise<void> => {
	const user = auth.currentUser;
	if (!user) return;

	await setDoc(doc(db, 'users', user.uid, 'profile', 'goals'), goals);
};

export const getGoals = async (): Promise<UserGoals | null> => {
	const user = auth.currentUser;
	if (!user) return null;

	const snapshot = await getDoc(doc(db, 'users', user.uid, 'profile', 'goals'));
	if (snapshot.exists()) {
		return snapshot.data() as UserGoals;
	}
	return null;
};

export const saveProfile = async (profile: object): Promise<void> => {
	const user = auth.currentUser;
	if (!user) return;
	
	await setDoc(doc(db, 'users', user.uid, 'profile', 'info'), profile);
};

export const getProfile = async (): Promise<any | null> => {
	const user = auth.currentUser;
	if (!user) return null;
	const snapshot = await getDoc(doc(db, 'users', user.uid, 'profile', 'info'));
	if (snapshot.exists()) {
		return snapshot.data();
	}

	return null;
};