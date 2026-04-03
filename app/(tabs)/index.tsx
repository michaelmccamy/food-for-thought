import { GoogleGenerativeAI } from '@google/generative-ai';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

const { GEMINI_API_KEY } = require('../../secret.json');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function HomeScreen() {
  const [result, setResult] = useState<string | null>(null);
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
        'Identify the food in this image and estimate the macros (calories, protein, carbs, fat). Be concise.',
      ]);
      setResult(result.response.text());
    } catch (e) {
      alert(String(e));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Food For Thought</Text>
      <Button title="Take Photo" onPress={takePhoto} />
      {result && <Text>{result}</Text>}
    </View>
  );
};