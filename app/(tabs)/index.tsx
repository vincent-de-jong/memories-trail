import { View, StyleSheet, Text, FlatList, Pressable, ToastAndroid } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import CircleButton from "@/components/CircleButton";
import ImageViewer from "@/components/ImageViewer";

import IconButton from "@/components/IconButton";
import { locate } from "@/utils/locate";
import { LocationObject } from "expo-location";
import OptionsListModal from "@/components/modals/OptionsListModal";
const PlaceholderImage = require("@/assets/images/background-image.png");
import 'react-native-get-random-values'
import { v4 as uuid } from "uuid";
import {  User } from "@/db/Cache";
import { useAsyncStorageData } from "@/db/useAsyncStorageData";

export default function Index() {
  const showToast = () => {
    ToastAndroid.showWithGravity('New memory added!', ToastAndroid.SHORT, ToastAndroid.TOP);
  };
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string>();

  const [location, setLocation] = useState<LocationObject | undefined>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  const {data: user, updateData} = useAsyncStorageData<User>('user')
  const takePhotoAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const onChooseAddOption = () => {
    setIsModalVisible(true);
  };
  const onSubmitMemory = () => {
    if (!location || !selectedImage) {
      return alert("Missing memory information!");
    }
    
    const date = new Date();
    updateData({
      ...(user ?? {memories: []}),
      memories: [
        ...(user?.memories ?? []),
        {
          coordinates: location,
          file: selectedImage,
          id: uuid(),
          timestamp: {
            unix: date.getTime(),
            utc: date.toUTCString(),
          },
        },
      ],
    });
    showToast();
    
  };

  const onLocateUser = async () => {
    const location = await locate();
    if (location.error) return setError(location.msg);
    return setLocation(location.res);
  };
  const isNewMemoryReady = selectedImage && location;
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
        {location && (
          <View>
            <Text>
              {location.coords.longitude} - {location.coords.latitude} -{" "}
              {location.coords.accuracy}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <IconButton
            icon="refresh"
            onPress={() => {
              setSelectedImage(undefined);
              setLocation(undefined)}}
          />
          <CircleButton
            onPress={isNewMemoryReady ? onSubmitMemory : onChooseAddOption}
            type={isNewMemoryReady ? "sparkle" : "add"}
          />
          <IconButton icon="location-pin" onPress={onLocateUser} />
        </View>
      </View>
      <OptionsListModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <FlatList
          data={OPTIONS}
          renderItem={(i) => {
            return (
              <Pressable
                onPress={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (i.item.id === "image-picker") await pickImageAsync();
                  if (i.item.id === "camera") await takePhotoAsync();
                }}
              >
                <View style={styles.flatListItemContainer}>
                  <Text style={styles.flatListItemText}>{i.item.title}</Text>
                  <View style={styles.separator} />
                </View>
              </Pressable>
            );
          }}
        ></FlatList>
      </OptionsListModal>
    </View>
  );
}

const OPTIONS: { id: "image-picker" | "camera"; title: string }[] = [
  { id: "image-picker", title: "Pick from your phone" },
  { id: "camera", title: "Take a photo" },
];

const styles = StyleSheet.create({
  flatListItemContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
  },
  flatListItemText: {
    fontSize: 18,
    color: "white",
  },
  separator: {
    marginTop: 24,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 0.4,
    width: "95%",
  },

  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
