import { Pressable, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "./Button";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
};

const BUTTON_OFFWHITE = "rgba(243, 236, 236, 0.862)";
export default function IconButton({ icon, onPress }: Props) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={32} color={BUTTON_OFFWHITE} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BUTTON_OFFWHITE,
    borderRadius: 42,
    padding: 8,
  },
  iconButtonLabel: {
    color: "#fff",
    marginTop: 12,
  },
});
