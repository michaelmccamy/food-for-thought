import { GoogleGenerativeAI } from '@google/generative-ai';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { GEMINI_API_KEY } = require('../../secret.json');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function HomeScreen() {
  const [result, setResult] = useState<{Food: string, Calories: number, Protein: number, Carbs: number, Fat: number} | null>(null);
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
      analyzeFood(photo.assets[0].base64);
    }
  };

  const analyzeFood = async (base64Image: string) => {
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
    }
  };

  return (
  <View style={styles.container}>
    <Text style={styles.title}>Food For Thought</Text>
    <Text style={styles.subtitle}>Take a photo to analyze your meal!</Text>
    <TouchableOpacity style={styles.button} onPress={takePhoto}>
      <Text style={styles.buttonText}>Take Photo</Text>
    </TouchableOpacity>
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
  </View>
)}
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    marginTop: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 24,
  },
  foodName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});