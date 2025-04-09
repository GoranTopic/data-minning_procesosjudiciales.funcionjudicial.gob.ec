import axios_main, { AxiosInstance } from 'axios';
import { api_endpoint } from './endpoints';
import { Causa } from '../types';

const endpoint = api_endpoint + '/getInformacionJuicio/';

/**
 * Get information about a specific case
 * @param judicaturaId - ID of the judiciary
 * @param axiosInstance - Optional axios instance to use for the request
 * @returns Case information
 */
export default async (judicaturaId: string, axiosInstance?: AxiosInstance): Promise<Causa> => {
    const axios = axiosInstance || axios_main;
    const trimmedId = judicaturaId.trim();
    try {
        const res = await axios.get(`${endpoint}/${trimmedId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return {} as Causa;
    }
};
