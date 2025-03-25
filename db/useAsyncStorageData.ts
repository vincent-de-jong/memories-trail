import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generic type for the data stored in AsyncStorage
export function useAsyncStorageData<T>(key: string) {
  // State to store the retrieved data
  const [data, setData] = useState<T | null>(null);
  
  // State to track loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch data from AsyncStorage
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Retrieve the stored data
      const storedData = await AsyncStorage.getItem(key);
      
      if (storedData !== null) {
        // Parse the JSON string back to an object
        const parsedData: T = JSON.parse(storedData);
        setData(parsedData);
      } else {
        setData(null);
      }
    } catch (err) {
      // Handle any errors during data retrieval
      setError(err instanceof Error ? err : new Error('Failed to retrieve data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update data in AsyncStorage
  const updateData = async (newData: T) => {
    try {
      // Convert data to JSON string for storage
      const jsonValue = JSON.stringify(newData);
      await AsyncStorage.setItem(key, jsonValue);
      
      // Update local state
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update data'));
    }
  };

  // Function to remove data from AsyncStorage
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setData(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove data'));
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [key]);

  // Return an object with data, loading state, error, and utility functions
  return {
    data,
    isLoading,
    error,
    fetchData,
    updateData,
    removeData
  };
}