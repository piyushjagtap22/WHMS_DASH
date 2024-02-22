import axios from 'axios';


const USERS_URL = `${import.meta.env.VITE_REACT_API_URL}/api/auth`;

export const login = (data) => axios.post(`${USERS_URL}/signin`, data);

export const register = (data) => axios.post(`${USERS_URL}/signup`, data);

export const verify = (data) => axios.post(`${USERS_URL}/verifycode`, data);

// export const getUserData = (token) => axios.post(`${USERS_URL}/getuser`, {}, {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });
const ENDPOINT = import.meta.env.VITE_REACT_API_URL;
export const updateUser = (data, token) => {
  // Make sure to pass the 'token' as an argument to this function
  return axios.post(`${import.meta.env.VITE_API_URL}/api/profile/update-profile`, data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

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

export const getUserData = (token) => axiosInstance.get(`/api/profile/getuser`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

export const getMongoUser = (token) => axios.get(`${USERS_URL}/get-mongo-user`, {
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }
});

export const getMongoUserByEmail = (email) => axios.get(`${ENDPOINT}/api/user/findUserByEmail/${email}`, {
  headers: { 'Content-Type': 'application/json' }
});

export const createMongoUser = (data, token) => {
  // pass token as an argument to this function
  return axios.post(`${USERS_URL}/create-mongo-user`, data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

