import { LocationObject } from "expo-location";
import { MMKV } from "react-native-mmkv";
export type Memory = {
  id: string;
  file: string;
  coordinates: LocationObject;

  timestamp: {
    unix: number;
    utc: string;
  };
};
export type User = {
  memories: Memory[];
};

export const storage = new MMKV();
