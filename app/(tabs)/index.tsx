import * as ImagePicker from 'expo-image-picker';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Food For Thought</Text>
      <Button title="Take Photo" onPress={takePhoto} />
    </View>
  );
}

const takePhoto = async() => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    alert('Camera permission is required!');
    return;
  }
  const photo = await ImagePicker.launchCameraAsync();
  console.log(photo);
};