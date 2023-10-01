import axios from 'axios';


const USERS_URL = import.meta.env.VITE_API_URL + '/api/auth';

export const login = (data) => axios.post(`${USERS_URL}/signin`, data);

export const register = (data) => axios.post(`${USERS_URL}/signup`, data);

export const verify = (data) => axios.post(`${USERS_URL}/verifycode`, data);

export const forgotPassword = (data) => axios.post(`${USERS_URL}/forget-password`, data);



const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
axiosInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config
  if (error.response.status === 403 && !originalRequest._retry) {
    const rToken = localStorage.getItem('refreshToken')
    originalRequest._retry = true
    const { data } = await axiosInstance.get(`${USERS_URL}/refresh`, {
      headers: {
        Authorization: `Bearer ${rToken}`,
      },
    })

    localStorage.setItem('accessToken', data.payload['accessToken'])
    originalRequest.headers.Authorization = `Bearer ${data.payload['accessToken']}`

    return axiosInstance(originalRequest)
  }

  return Promise.reject(error)
})

