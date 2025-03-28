import {
  checkLocationInRadius,
  Coordinate,
  LocationRadiusResult,
} from "./proximity";

describe("Proximity algorithm", () => {
  it("works", () => {
    const newYorkLocation: Coordinate = {
      latitude: 40.7128, // New York City latitude
      longitude: -74.006, // New York City longitude
    };

    const JFKAirport: Coordinate = 
      { latitude: 40.7282, longitude: -73.7949 }// JFK Airport
    ;

    const maxRadius: number = 50; // 50 kilometers

    // Type-safe result
    const result: LocationRadiusResult = checkLocationInRadius(
        newYorkLocation,
      [JFKAirport],
      maxRadius
    );
    expect(result.isWithinRadius).toBeTruthy();

    const parmaLocation: Coordinate = {
        latitude: 44.801472,
        longitude: 10.328000
    }
    const failure = checkLocationInRadius(parmaLocation, [JFKAirport], 20)
    expect(failure.isWithinRadius).toBeFalsy()
  });
});
