import { storage, User } from "@/db/Cache";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";

export default function Memories() {
  const [user] = useMMKVObject<User>("user", storage);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {!user?.memories.length && (
        <View>
          <Text style={styles.text}>No memories yet!</Text>
        </View>
      )}
      {user?.memories.map((item) => (
        <View>
          <Text>{item.id}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
});
