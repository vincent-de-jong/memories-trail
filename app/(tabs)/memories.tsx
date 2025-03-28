import { MemoryTile } from "@/components/scoped/MemoryTile";
import { User } from "@/db/Cache";
import { useAsyncStorageData } from "@/db/useAsyncStorageData";
import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function Memories() {
  const { data: user, fetchData } = useAsyncStorageData<User>("user");
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchData();
    }, 1200);
  }, []);

  return (
    <View style={styles.list}>
      {!user?.memories.length && (
        <View>
          <Text style={styles.text}>No memories yet!</Text>
        </View>
      )}
      <FlatList
      style={{width: '100%'}}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={user?.memories ?? []}
        renderItem={({ item: i }) => <MemoryTile key={i.id} memory={i} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },

  list: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
});
