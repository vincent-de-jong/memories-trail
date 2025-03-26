import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  ToastAndroid,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import CircleButton from "@/components/CircleButton";
import ImageViewer from "@/components/ImageViewer";

import IconButton from "@/components/IconButton";
import { locate } from "@/utils/locate";
import { LocationObject } from "expo-location";
import OptionsListModal from "@/components/modals/OptionsListModal";
const PlaceholderImage = require("@/assets/images/background-image.png");
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { Memory, MemoryInput, MemoryInputPartial, User } from "@/db/Cache";
import { useAsyncStorageData } from "@/db/useAsyncStorageData";

export default function Index() {
  const showToast = () => {
    ToastAndroid.showWithGravity(
      "New memory added!",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };

  const [memory, setMemory] = useState<MemoryInputPartial>({});
  const [error, setError] = useState<string>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMemory({ ...memory, file: result.assets[0].uri });
    }
  };
  const { data: user, updateData } = useAsyncStorageData<User>("user");
  const takePhotoAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMemory({ ...memory, file: result.assets[0].uri });
    }
  };

  const onChooseAddOption = () => {
    setIsModalVisible(true);
  };
  const onSubmitMemory = () => {
    if (!memory.coordinates || !memory.coordinates) {
      return alert("Missing memory information!");
    }
    const memoryInput = memory as MemoryInput;
    const date = new Date();

    const newMemory: Memory = {
      id: uuid(),
      timestamp: {
        unix: date.getTime(),
        utc: date.toUTCString(),
      },
      ...memoryInput,
    };
    updateData({
      ...(user ?? { memories: [] }),
      memories: [...(user?.memories ?? []), newMemory],
    });
    showToast();
  };

  const onLocateUser = async () => {
    const location = await locate();
    if (location.error) return setError(location.msg);
    return setMemory({ ...memory, coordinates: location.res });
  };
  const isNewMemoryReady = (memory.text || memory.file) && location;
  const memoryTextLenght = memory.text?.length ?? 0
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={memory.file} />
        {!!memoryTextLenght && <View style={styles.textCounterContainer}><Text style={styles.textCounter} >{memoryTextLenght}/400</Text></View>}
        <TextInput
          autoCapitalize={"sentences"}
          focusable={false}
          multiline
          
          style={{
            ...{ outlineStyle: "none" },
            ...styles.input,
            ...(memoryTextLenght < 200
              ? styles.largeFontSize
              : memoryTextLenght < 250 ? styles.mediumFontSize: styles.smallFontSize),
          }}
          numberOfLines={9}
          maxLength={400}
          placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
          placeholder={"Words help memories being more vivid"}
          value={memory.text}
          onChangeText={(v) => setMemory({ ...memory, text: v })}
        />
        {memory.coordinates && (
          <View>
            <Text>
              {memory.coordinates.coords.longitude} -{" "}
              {memory.coordinates.coords.latitude} -{" "}
              {memory.coordinates.coords.accuracy}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <IconButton
            icon="refresh"
            onPress={() => {
              setMemory({});
            }}
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
  input: {
    color: "#rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    marginBottom: 8,
    height: 'auto'
  },
  textCounterContainer: {display: 'flex', alignItems: 'flex-end', marginTop: 24},
  textCounter: {
    fontSize: 12,
    color: "#rgba(255, 255, 255, 0.6)"
  },
  smallFontSize: { fontSize: 12 },
  mediumFontSize: {fontSize: 16},
  largeFontSize: { fontSize: 18 },

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
    marginBottom: 80
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
