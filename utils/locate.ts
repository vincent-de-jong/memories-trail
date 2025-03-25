import * as Location from "expo-location";

export const locate = async (): Promise<
  { error: false; res: Location.LocationObject } | { error: true; msg: string }
> => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return { error: true, msg: "Permission to access location was denied" };
  }

  return { error: false, res: await Location.getCurrentPositionAsync({}) };
};
