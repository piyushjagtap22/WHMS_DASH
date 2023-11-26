import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})


const ADMIN_URL = "http://localhost:3000" + '/api/admin';

export const AddUsersToAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${ADMIN_URL}/add-users`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const RemoveUsersFromAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${ADMIN_URL}/remove-users`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const getUnallocatedUsers = (token) => {
    // pass token as an argument to this function
    return axios.get(`${ADMIN_URL}/get-unallocated-users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const getAdminUsers = (token, data) => {
    // pass token as an argument to this function
    return axios.get(`${ADMIN_URL}/get-added-users`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

