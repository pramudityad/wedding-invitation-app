export const useApiCall = () => {
  const executeApiCall = async (apiFunction, errorMessage) => {
    try {
      const response = await apiFunction();
      return response;
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      throw error;
    }
  };

  return { executeApiCall };
};
