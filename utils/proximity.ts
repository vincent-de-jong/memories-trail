/**
 * Interface for geographical coordinates
 */
export interface Coordinate {
    latitude: number;
    longitude: number;
  }
  
  /**
   * Interface for the result of location radius check
   */
  export interface LocationRadiusResult {
    isWithinRadius: boolean;
    nearestCoordinate: (Coordinate & { distanceFromCurrentLocation: number }) | null;
  }
  
  /**
   * Calculate the great-circle distance between two coordinates using the Haversine formula
   * @param coord1 - First coordinate
   * @param coord2 - Second coordinate
   * @returns Distance in kilometers
   */
  function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
    // Earth's radius in kilometers
    const EARTH_RADIUS = 6371;
  
    // Convert latitude and longitude from degrees to radians
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
    
    const lat1 = toRadians(coord1.latitude);
    const lon1 = toRadians(coord1.longitude);
    const lat2 = toRadians(coord2.latitude);
    const lon2 = toRadians(coord2.longitude);
  
    // Differences in coordinates
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    // Haversine formula
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1) * Math.cos(lat2) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    // Distance in kilometers
    return EARTH_RADIUS * c;
  }
  
  /**
   * Check if a current location is within a given set of coordinates and radius
   * @param currentLocation - Current location
   * @param coordinateSet - Array of coordinates to check
   * @param maxRadius - Maximum radius in kilometers
   * @returns Result object with isWithinRadius and nearestCoordinate
   */
  export function checkLocationInRadius(
    currentLocation: Coordinate, 
    coordinateSet: Coordinate[], 
    maxRadius: number
  ): LocationRadiusResult {
    // Validate inputs
    if (!currentLocation || !coordinateSet || !Array.isArray(coordinateSet)) {
      throw new Error('Invalid input parameters');
    }
  
    // Find the nearest coordinate
    const nearestCoordinate = coordinateSet.reduce<{
      coordinate: Coordinate | null;
      distance: number;
    }>((nearest, coordinate) => {
      const distance = calculateDistance(currentLocation, coordinate);
      
      // First iteration or found a closer coordinate
      if (!nearest.coordinate || distance < nearest.distance) {
        return {
          coordinate,
          distance
        };
      }
      
      return nearest;
    }, { coordinate: null, distance: Infinity });
  
    // Check if the nearest coordinate is within the max radius
    return {
      isWithinRadius: nearestCoordinate.coordinate !== null && 
                      nearestCoordinate.distance <= maxRadius,
      nearestCoordinate: nearestCoordinate.coordinate ? {
        ...nearestCoordinate.coordinate,
        distanceFromCurrentLocation: nearestCoordinate.distance
      } : null
    };
  }

  
