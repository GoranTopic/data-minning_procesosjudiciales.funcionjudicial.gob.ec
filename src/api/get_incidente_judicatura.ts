import axios_main, { AxiosInstance } from 'axios';
import { api_endpoint_clex } from './endpoints';
import { Incidente } from '../types';

const endpoint = api_endpoint_clex + 'getIncidenteJudicatura';

/**
 * Get incidents for a specific judiciary
 * @param judicaturaId - ID of the judiciary
 * @param axiosInstance - Optional axios instance to use for the request
 * @returns Array of incidents
 */
export default async (judicaturaId: string, axiosInstance?: AxiosInstance): Promise<Incidente[]> => {
    const axios = axiosInstance || axios_main;
    const trimmedId = judicaturaId.trim();
    try {
        const res = await axios.get(`${endpoint}/${trimmedId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};
