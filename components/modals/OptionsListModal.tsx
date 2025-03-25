import { PropsWithChildren } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function OptionsListModal({
  isVisible,
  children,
  onClose,
}: Props) {
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <TouchableOpacity style={{ height: "100%" }} onPress={onClose}>
          <View style={styles.modalContent}>{children}</View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "35%",
    width: "100%",
    backgroundColor: "#cb1c1c",
    borderWidth: 4,
    borderColor: "#8d0e0e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
});
