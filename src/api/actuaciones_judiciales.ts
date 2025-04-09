import axios_main, { AxiosInstance } from 'axios';
import { api_endpoint } from './endpoints';
import { Incidente } from '../types';

const endpoint = api_endpoint + '/actuacionesJudiciales';

/**
 * Get judicial actions for a specific case
 * @param juicio - Object with case information
 * @param axiosInstance - Optional axios instance to use for the request
 * @returns Array of judicial actions
 */
export default async (juicio: Incidente, axiosInstance?: AxiosInstance): Promise<any[]> => {
    const axios = axiosInstance || axios_main;
    try {
        const res = await axios.post(endpoint, juicio);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};
