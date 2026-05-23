import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../utils/firebase';

export default function Index() {
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.replace('/(tabs)');
			} else {
				router.replace('/login');
			}
		});

		return unsubscribe;
	}, []);

	return null;
}