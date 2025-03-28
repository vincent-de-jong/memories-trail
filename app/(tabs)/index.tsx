import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  ToastAndroid,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import CircleButton from "@/components/CircleButton";
import ImageViewer from "@/components/ImageViewer";

import IconButton from "@/components/IconButton";
import { locate } from "@/utils/locate";
import OptionsListModal from "@/components/modals/OptionsListModal";
const PlaceholderImage = require("@/assets/images/background-image.png");
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { Memory, MemoryInput, MemoryInputPartial, User } from "@/db/Cache";
import { useAsyncStorageData } from "@/db/useAsyncStorageData";
import Slider from "@react-native-community/slider";

export default function Index() {
  const showToast = () => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        "New memory added!",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

  const [memory, setMemory] = useState<MemoryInputPartial>({ radius: 2 });
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
  const isNewMemoryReady =
    (memory.text || memory.file) && memory.coordinates && memory.radius;
  const memoryTextLenght = memory.text?.length ?? 0;
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.imageContainer}>
              <ImageViewer
                imgSource={PlaceholderImage}
                selectedImage={memory.file}
              />
            </View>
            <View>
              <TextInput
                textAlign="center"
                autoCapitalize={"sentences"}
                focusable={false}
                multiline
                style={{
                  ...{ outlineStyle: "none" },
                  ...styles.input,
                  ...(memoryTextLenght < 80
                    ? styles.largeFontSize
                    : memoryTextLenght < 120
                    ? styles.mediumFontSize
                    : styles.smallFontSize),
                }}
                numberOfLines={9}
                maxLength={200}
                placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
                placeholder={"Add a note to make memories more vivid"}
                value={memory.text}
                onChangeText={(v) => setMemory({ ...memory, text: v })}
              />
            </View>
            <View style={styles.sliderContainer}>
              <View style={{margin: 8}}><Text style={styles.radiusText}>
                The memory will appear {memory.radius?.toPrecision(2) ?? 0}km
                within your current position
              </Text>
              <Slider
                onValueChange={(v) => setMemory({ ...memory, radius: v })}
                style={{ height: 30, width: "100%" }}
                minimumValue={0.2}
                step={0.2}
                value={memory.radius}
                maximumValue={5}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#FFFFFF"
                vertical={true}
              />
            </View></View>
            <View style={styles.optionsContainer}>
              <View style={styles.optionsRow}>
                <IconButton
                  icon="refresh"
                  onPress={() => {
                    setMemory({});
                  }}
                />
                <CircleButton
                  onPress={
                    isNewMemoryReady ? onSubmitMemory : onChooseAddOption
                  }
                  type={isNewMemoryReady ? "sparkle" : "add"}
                />

                <IconButton icon="location-pin" onPress={onLocateUser} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

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
    </ScrollView>
  );
}

const OPTIONS: { id: "image-picker" | "camera"; title: string }[] = [
  { id: "image-picker", title: "Pick from your phone" },
  { id: "camera", title: "Take a photo" },
];

const styles = StyleSheet.create({
  radiusText: {
    color: "#rgba(255, 255, 255, 0.8)",
  },
  input: {
    color: "#rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    marginBottom: 24,
    maxWidth: "95%",
  },
  textCounterContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: 24,
  },
  textCounter: {
    fontSize: 12,
    color: "#rgba(255, 255, 255, 0.6)",
  },
  smallFontSize: { fontSize: 12 },
  mediumFontSize: { fontSize: 16 },
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
    width: "100%",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    marginBottom: "15%",
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  scrollView: {
    height: "100%",
    backgroundColor: "rgb(37, 41, 46)",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "10%",
    paddingLeft: "10%",
  },
  sliderContainer: {
    marginBottom: 16,
    backgroundColor: "rgba(37, 41, 46, 0.6)",
    borderWidth: 1,
    padding: 8,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 8
  },
});
