import { LocationObject } from "expo-location";
export type Memory = {
  id: string;
  file: string;
  text: string;
  coordinates: LocationObject;

  timestamp: {
    unix: number;
    utc: string;
  };
};

export type MemoryInput = Pick<Memory, 'coordinates'|'file'|'text'>
export type MemoryInputPartial = Partial<MemoryInput>
export type User = {
  memories: Memory[];
};

