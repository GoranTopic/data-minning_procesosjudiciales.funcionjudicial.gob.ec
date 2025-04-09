import axios_main, { AxiosInstance } from 'axios';
import { api_endpoint } from './endpoints';
import { SearchQuery } from '../types';

const endpoint = api_endpoint + 'contarCausas';

/**
 * Count the number of causes matching the search criteria
 * @param causa - Object with search parameters
 * @param axiosInstance - Optional axios instance to use for the request
 * @returns Number of causes matching the search criteria
 */
export default async (causa: SearchQuery, axiosInstance?: AxiosInstance): Promise<number> => {
    const axios = axiosInstance || axios_main;
    try {
        const res = await axios.post(endpoint, causa);
        if (res === undefined) {
            console.error('response from contar causas is empty', res);
            throw new Error('response from contar causas is empty');
        }
        return res.data;
    } catch (error) {
        // print only error message
        throw error;
    }
};
