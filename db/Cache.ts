import { LocationObject } from "expo-location";
export type Memory = {
  id: string;
  file?: string;
  text: string;
  coordinates: LocationObject;
  // radius in km to trigger memory
  radius: number;

  timestamp: {
    unix: number;
    utc: string;
  };
};

export type MemoryInput = Pick<
  Memory,
  "coordinates" | "file" | "text" | "radius"
>;
export type MemoryInputPartial = Partial<MemoryInput>;
export type User = {
  memories: Memory[];
};
