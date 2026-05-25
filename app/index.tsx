import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../utils/firebase';
import { getProfile } from '../utils/storage';

export default function Index() {
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const profile = await getProfile();
				if (profile) {
					router.replace('/(tabs)');
				} else {
					router.replace('/onboarding');
				}
			} else {
				router.replace('/login');
			}
		});

		return unsubscribe;
	}, []);

	return null;
}