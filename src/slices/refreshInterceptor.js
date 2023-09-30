// import axios from 'axios'

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
// })

// axiosInstance.interceptors.response.use((response) => {
//   return response
// }, async function (error) {
//   const originalRequest = error.config
//   if (error.response.status === 403 && !originalRequest._retry) {
//     const rToken = localStorage.getItem('refreshToken')
//     originalRequest._retry = true
//     const { data } = await axiosInstance.get('/api/auth/refresh', {
//       headers: {
//         Authorization: `Bearer ${rToken}`,
//       }, 
//     })

//     localStorage.setItem('accessToken', data.payload['accessToken'])
//     originalRequest.headers.Authorization = `Bearer ${data.payload['accessToken']}`

//     return axiosInstance(originalRequest)
//   }

//   return Promise.reject(error)
// })

// export default axiosInstance

