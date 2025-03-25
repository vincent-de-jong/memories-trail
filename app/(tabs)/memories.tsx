import { User } from "@/db/Cache";
import { useAsyncStorageData } from "@/db/useAsyncStorageData";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function Memories() {
  const { data: user, fetchData } = useAsyncStorageData<User>("user");
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchData()
    }, 1200);
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}  refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {!user?.memories.length && (
            <View>
              <Text style={styles.text}>No memories yet!</Text>
            </View>
          )}
          {user?.memories.map((item) => (
            <View key={item.id}>
              <Text>{item.id}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
});
