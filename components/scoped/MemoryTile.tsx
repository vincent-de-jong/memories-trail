import { Memory } from "@/db/Cache";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";


export function MemoryTile({ memory }: { memory: Memory }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleExpand = () => setIsExpanded(!isExpanded)
  return (
    <Pressable style={{...styles.memoryTile, ...(isExpanded ? { height: 'fit-content'} as any : {})}} key={memory.id} onPress={toggleExpand}>
      <View style={styles.textContainer}>
        <Text ellipsizeMode="tail" numberOfLines={isExpanded ? undefined:1} style={styles.tileText}>
          {memory.text}
        </Text>
        <Text style={styles.tileTimestampText}>{memory.timestamp.utc}</Text>
        {isExpanded && <View><Text>Radius {memory.radius}km from LAT {memory.coordinates.coords.latitude}, LONG {memory.coordinates.coords.longitude}</Text></View>}

      </View>
      {memory.file && <Image source={memory.file} style={styles.tileImage} />}
    </Pressable>
  );
}



const styles = StyleSheet.create({
  memoryTile: {
    padding: 8,
    margin: 8,
    borderColor: "hotpink",
    borderWidth: 1,
    borderRadius: 15,
    height: 70,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  
  textContainer: {
    width: "80%",
  },
  tileTimestampText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  tileText: {
    color: "rgba(255, 255, 255, 0.8)",
    marginRight: 8,
    marginBottom: 4,
  },
  tileImage: {
    marginRight: 8,
    height: 30,
    width: 30,
  },
});
