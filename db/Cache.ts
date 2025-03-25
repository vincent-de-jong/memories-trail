import { LocationObject } from "expo-location";
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

