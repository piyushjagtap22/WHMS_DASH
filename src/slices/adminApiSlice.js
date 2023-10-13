import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const ADMIN_URL = import.meta.env.VITE_API_URL + '/api/admin';

export const AddUsersToAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${ADMIN_URL}/add-users`, data, {
        headers : { 'Authorization': `Bearer ${token}` }
    });
};

export const RemoveUsersFromAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${ADMIN_URL}/remove-users`, data, {
        headers : { 'Authorization': `Bearer ${token}` }
    });
}