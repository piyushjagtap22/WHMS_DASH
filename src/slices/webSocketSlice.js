import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as Ably from 'ably';

// Ably instance
let ably = null;
let channel = null;

// Async thunk for initializing Ably connection
export const initializeAbly = createAsyncThunk(
  'websocket/initialize',
  async (userId, { dispatch }) => {
    try {
      // Cleanup existing connection if any
      if (ably) {
        ably.close();
      }

      // Initialize Ably
      ably = new Ably.Realtime({
        key: 'Ud_aPw.Vdo9OQ:sWTIjTqlzL5gZRJz6XUUwfNdXTMNvYvSYF6duiOT75Y',
        clientId: userId
      });

      // Connect to the sensor data channel
      channel = ably.channels.get('sensor-data');

      // Handle connection state changes
      ably.connection.on((stateChange) => {
        dispatch(setConnectionStatus(stateChange.current));
        
        if (stateChange.reason) {
          dispatch(setError(stateChange.reason.toString()));
        }
      });

      // Subscribe to sensor data
      channel.subscribe((message) => {
        dispatch(updateSensorData(message.data));
      });

      // Or subscribe to specific user's data
      channel.subscribe(`user-${userId}`, (message) => {
        dispatch(updateSensorData(message.data));
      });

      return true;
    } catch (error) {
      console.error('Ably initialization error:', error);
      throw error;
    }
  }
);

// Async thunk for disconnecting
export const disconnectAbly = createAsyncThunk(
  'websocket/disconnect',
  async () => {
    if (channel) {
      await channel.unsubscribe();
    }
    if (ably) {
      await ably.close();
      ably = null;
      channel = null;
    }
    return true;
  }
);

// Async thunk for publishing events
export const publishAblyEvent = createAsyncThunk(
  'websocket/publish',
  async ({ event, data }) => {
    if (channel) {
      await channel.publish(event, data);
    }
    return true;
  }
);

const initialState = {
  connectionStatus: 'disconnected',
  sensorData: [],
  isLoading: false,
  error: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    updateSensorData: (state, action) => {
      state.sensorData = [...state.sensorData, action.payload].slice(-50); // Keep last 50 readings
    },
    clearSensorData: (state) => {
      state.sensorData = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAbly.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAbly.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeAbly.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setConnectionStatus,
  updateSensorData,
  clearSensorData,
  setError,
} = websocketSlice.actions;

export default websocketSlice.reducer;