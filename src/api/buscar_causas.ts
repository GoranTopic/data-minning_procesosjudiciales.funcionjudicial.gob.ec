import { api_endpoint } from './endpoints';
import axios_main, { AxiosInstance } from 'axios';
import { SearchQuery, Causa } from '../types';

const size = 100;
const page = 1;
const endpoint = api_endpoint + `/buscarCausas?page=${page}&size=${size}`;

/**
 * @param causa - Object with search parameters
 * @param axiosInstance - Optional axios instance to use for the request
 * @returns Array of causes matching the search criteria
 */
export default async (causa: SearchQuery, axiosInstance?: AxiosInstance): Promise<Causa[]> => {
    const axios = axiosInstance || axios_main;
    try {
        const res = await axios.post(endpoint, causa);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};
