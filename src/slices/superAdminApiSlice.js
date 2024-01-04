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

export const docById = (data, token) => {
    console.log("slice riunning doc by Id");
    console.log("datatatatata",data)
    
    return axios.get(`${SUPERADMIN_URL}/getDocById`, data, {
        headers: { 'Authorization': "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjUyNmM2YTg0YWMwNjcwMDVjZTM0Y2VmZjliM2EyZTA4ZTBkZDliY2MiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUGl5dXNoIEphZ3RhcCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJNGdWaVdFRkdHa2Jrbm1YdDlkcGlrck1CeDhVRmc4WWQzTjY5NFdSNWs9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd2htcy1hdXRoLTdlZDRiIiwiYXVkIjoid2htcy1hdXRoLTdlZDRiIiwiYXV0aF90aW1lIjoxNzA0Mzc0MTE3LCJ1c2VyX2lkIjoibjlSeXdTV05nU1hQVHdPcWhhTUFvbUk5SVlpMSIsInN1YiI6Im45Unl3U1dOZ1NYUFR3T3FoYU1Bb21JOUlZaTEiLCJpYXQiOjE3MDQzNzQxMTcsImV4cCI6MTcwNDM3NzcxNywiZW1haWwiOiJwanRlbXBpZEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwMjQ4MDA4NjE0NzE3MDU0MjUxMCJdLCJlbWFpbCI6WyJwanRlbXBpZEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.QQiaX7nGy9DFbhtavRAFCxfSsScpuAqpeTHZg9YSDj92ndsj4oadqgEIKtGTIAxCHOWCUSVkfX9wlwVcSn-fGEclfu0yQTFMtIhzIIG-tLLKrZ_rl4au-xpFGBfXiauPejefhdNGiFDOOMlDslc5sWe5BZqTLmJIad-qUrsBDboNCNiom7aL90YPb9XNJDMnSUKktbYDhZ8lISOvCzQtZRAdm4PFxslmD1gr3WG7_OYZSuF_GnbhuqmOpTtoKJ5BTDK8qynXSLZqS9qLP93q5ASraE09kEyBUNtMSiGpSsbFKoobwZxEFuMrCrXzS9ZwBr8owM0lQnYoBzVPnyXWMQ" }
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
