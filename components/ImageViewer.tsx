import { StyleSheet, View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';

type Props = {
  imgSource: ImageSource;
  selectedImage?: string;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
  return <View style={styles.container}><Image source={imageSource} style={styles.image} /></View>;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16
  },
  image: {
    width: 320 / 1.2,
    height: 440 / 1.2,
    borderRadius: 18,
  },
});
