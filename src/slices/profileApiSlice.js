import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const PROFILE_URL = import.meta.env.VITE_API_URL + '/api/profile';

export const updateUser = (data, token) => {
    // Make sure to pass the 'token' as an argument to this function
    return axios.post(`${PROFILE_URL}/update-profile`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const getUserData = (token) => axiosInstance.get(`${PROFILE_URL}/getuser`, {
    headers: { 'Authorization': `Bearer ${token}` }
});

export const getProfileData = (token) => axiosInstance.get(`${PROFILE_URL}/get-profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
});


