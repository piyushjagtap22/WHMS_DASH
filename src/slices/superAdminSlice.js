import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Define the initial state for profile data
    userInfo : [],
}

const SuperAdminSlice = createSlice({
    name : 'superAdmin',
    initialState,
    reducers: {
        //To fetch all users
        SetUsers : (state, action) => {
            console.log(action, payload)
            state.userInfo = action.payload;
        },
    },
});

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

export const getDeviceIds = (token) => {
    console.log("getDevice id chsla");
    return axios.get(`admin/getDeviceIds`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }); 
}

export const { SetUsers } = SuperAdminSlice.actions;

export default SuperAdminSlice.reducer;