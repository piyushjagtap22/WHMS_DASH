import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_API_URL
})


const ADMIN_URL = `${import.meta.env.VITE_REACT_API_URL}/api/admin`;

export const AddUsersToAdmin = (data, token) => {
    // pass token as an argument to this function
    return axios.post(`${ADMIN_URL}/add-users`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};


// export const getUserById =(data,token) => {
//     alert(data);

//     var myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);
//     myHeaders.append("Content-Type", "application/json");

//     var raw = JSON.stringify({
//     "deviceId": "deviceId1"
//     });

//     var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: raw,
//     redirect: 'follow'
//     };

//     fetch("http://localhost:3000/api/admin/getDeviceData", requestOptions)
//     .then(response => response.text())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));
// }

export const getDeviceIds = (token) => {
    console.log("getDevice id chala");
    return axios.get(`${ADMIN_URL}/getDeviceIds`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export const getSensorDB = (token, id) => {
    return axios.post(`http://localhost:3000/api/admin/getSensordb`, { id }, {
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


