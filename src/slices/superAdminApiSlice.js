import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const SUPERADMIN_URL = "http://localhost:3000" + '/api/superadmin';

export const createAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${SUPERADMIN_URL}/upsertadmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const removeAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${SUPERADMIN_URL}/removeadmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const getAllUsers = (token) => axios.get(`${SUPERADMIN_URL}/getallusers`, {
    headers: { 'Authorization': `Bearer ${token}` }
});