import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_API_URL
})


const ADMIN_URL = `https://whms-isro-sxur-cpbr-eyqdlmmsn-bugzzbunny007s-projects.vercel.app/api/admin`;

export const AddUsersToAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${ADMIN_URL}/add-users`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};



export const getDeviceIds = (token) => {
    console.log("getDevice id chala");
    return axios.get(`${ADMIN_URL}/getDeviceIds`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const getSensorDB = (token, id) => {
    return axios.post(`https://whms-isro-sxur-cpbr-eyqdlmmsn-bugzzbunny007s-projects.vercel.app/api/admin/getSensordb`, { id }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

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


export const getLoc = (token, data) => {
    // pass token as an argument to this function
    // console.log("in get location", data)
    return axios.post(`${ADMIN_URL}/getLocation`, { currentUserId: data }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}


