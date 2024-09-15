import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
    // Define the initial state for profile data
    adminInfo: null, // You can set it to null or an empty object initially
    currentDevice: null,
    currentDeviceUserId: null,
    location: [null, null],
    sensorData: {
        heartRateObj: null,
        breathRateObj: null,
        ventilationObj: null,
        activityObj: null,
        bpObj: null,
        candenceObj: null,
        oxygenSaturationObj: null,
        tempObj: null,
        tidalVolObj: null
    },
    currentDeviceData: null,
};

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        // Define actions to update profile data
        setAdminInfo: (state, action) => {
            console.log(action.payload)
            state.adminInfo = action.payload;
        },
        setCurrentDeviceUserId: (state, action) => {
            console.log("device user id", action.payload)
            state.currentDeviceUserId = action.payload;
        },

        setCurrentDevice: (state, action) => {
            state.currentDevice = action.payload; // Corrected this line
        },
        setLocation: (state, action) => {
            console.log(action.payload.lat)
            state.location = [action.payload.lat, action.payload.lon]
        },
        setSensorData: (state, action) => {
            if (!state.sensorData) {
                state.sensorData = {};
            }

            state.sensorData['heartRateObj'] = action.payload['heartSensor'] ?? null;
            state.sensorData['breathRateObj'] = action.payload['BreathRateSensor'] ?? null;
            state.sensorData['ventilationObj'] = action.payload['VentilatonSensor'] ?? null;
            state.sensorData['activityObj'] = action.payload['ActivitySensor'] ?? null;
            state.sensorData['bpObj'] = action.payload['BloodPressureSensor'] ?? null;
            state.sensorData['candenceObj'] = action.payload['CadenceSensor'] ?? null;
            state.sensorData['oxygenSaturationObj'] = action.payload['OxygenSaturationSensor'] ?? null;
            state.sensorData['tempObj'] = action.payload['TemperatureSensor'] ?? null;
            state.sensorData['tidalVolObj'] = action.payload['TidalVolumeSensor'] ?? null;


            // state.sensorData.heartRateData = [action.payload['heartSensor']];
            // state.sensorData.heartRateTimeStamp = [action.payload.heartRateTime];
        },
        setCurrentDeviceData: (state, action) => {
            console.log("Setting device data", action.payload)
            state.currentDeviceData = action.payload
        }

        // Add more actions as needed
    },
});



export const { setAdminInfo, setCurrentDeviceData, setCurrentDevice, setLocation, setSensorData, setCurrentDeviceUserId } = deviceSlice.actions;

export default deviceSlice.reducer;