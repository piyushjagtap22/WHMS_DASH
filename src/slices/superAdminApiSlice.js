
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_API_URL
})

const SUPERADMIN_URL = import.meta.env.VITE_REACT_API_URL + '/api/superadmin';

export const createAdmin = (data, token) => {

    // pass token as an argument to this function
    return axios.post(`${SUPERADMIN_URL}/upsertadmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}
console.log("superadmin" + SUPERADMIN_URL);

export const addDeviceID = (data, token) => {
    console.log("slice running")
    console.log('check the data', data)
    // pass token as an argument to this function
    return axios.post(`${SUPERADMIN_URL}/addDeviceIdToAdmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const removeAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${SUPERADMIN_URL}/removeadmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const enableAdmin = (data, token) => {
    console.log("slice riunning");
    return axios.post(`${SUPERADMIN_URL}/enableAdmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const disableAdmin = (data, token) => {
    console.log("slice riunning disable");
    return axios.post(`${SUPERADMIN_URL}/disableAdmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}


export const approveDocById = (data, token) => {
    console.log("Approve doc by id running", data);
    return axios.post(`${SUPERADMIN_URL}/approveAdminDocById`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}



export const getAllUsers = (token) => axios.get(`${SUPERADMIN_URL}/getallusers`, {
    headers: { 'Authorization': `Bearer ${token}` }
});


export const getAllAdmin = (token) => {
    return axios.get(`${SUPERADMIN_URL}/getAllAdmin`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}
