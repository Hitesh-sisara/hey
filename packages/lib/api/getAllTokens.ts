import { HEY_API_URL } from '@hey/data/constants';
import type { AllowedToken } from '@hey/types/hey';
import axios from 'axios';

/**
 * Get all allowed tokens
 * @param callbackFn callback function
 * @returns all allowed tokens
 */
const getAllTokens = async (
  callbackFn?: (tokens: AllowedToken[]) => void
): Promise<AllowedToken[]> => {
  try {
    const response = await axios.get(`${HEY_API_URL}/token/all`);
    const { data } = response;
    callbackFn?.(data?.tokens || []);

    return data?.tokens || [];
  } catch (error) {
    throw error;
  }
};

export default getAllTokens;
