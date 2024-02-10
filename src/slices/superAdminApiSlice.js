
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const SUPERADMIN_URL = import.meta.env.VITE_API_URL + '/api/superadmin';

export const createAdmin = (data, token) => {

    // pass token as an argument to this function
    return axios.post(`${SUPERADMIN_URL}/upsertadmin`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

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

//     fetch("https://whms-isro-sxur.vercel.app/api/admin/getDeviceData", requestOptions)
//     .then(response => response.text())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));
// }

// export const getDeviceIds = (token) => {
//     console.log("getDevice id chala");
//     return axios.get(`admin/getDeviceIds`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//     }); 
// }


export const addDeviceID = (data, token) => {
    console.log("slice running")
    console.log('check the data',data)
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


export const approveDocById = (data,token) => {
    console.log("Approve doc by id running",data);
    return axios.post(`${SUPERADMIN_URL}/approveAdminDocById`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

// export const docById = (data, token) => {
//     console.log("slice riunning doc by Id");
//     console.log("datatatatata",data)
    
//     return axios.post(`${SUPERADMIN_URL}/getDocById`, data, {
//         'Content-Type': 'application/json',
//         headers: { 'Authorization': `Bearer ${token}` }

//     });
// }

// export const docById = async (data,token) =>{
    
//     const apiUrl = 'https://whms-isro-sxur.vercel.app/api/superadmin/getDocById';
//     const authToken =
//       `Bearer ${token}`;

//     fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: authToken,
//       },
//       body: JSON.stringify({ _id: data }),
//     })
//       .then((response) => response.blob())
//       .then((blob) => {
//         var imageUrl = "";
//         return imageUrl = URL.createObjectURL(blob);
        
//       })
//       .catch((error) => console.error('Error fetching image:', error));
//     }

export const getAllUsers = (token) => axios.get(`${SUPERADMIN_URL}/getallusers`, {
    headers: { 'Authorization': `Bearer ${token}` }
});


export const getAllAdmin = (token) => {
    return axios.get(`${SUPERADMIN_URL}/getAllAdmin`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}
