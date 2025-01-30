import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const SOCKET_URL =  'http://localhost:3000';

// Create socket instance
let socket = null;

// Async thunk for initializing socket connection
export const initializeSocket = createAsyncThunk(
  'websocket/initialize',
  async (_, { dispatch }) => {
    // If socket exists, disconnect it first
    if (socket) {
      socket.disconnect();
    }

    // Create new socket connection
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    // Set up event listeners
    socket.on('connect', () => {
      dispatch(setConnectionStatus('connected'));
    });

    socket.on('disconnect', (reason) => {
      dispatch(setConnectionStatus(`disconnected: ${reason}`));
    });

    socket.on('connect_error', (error) => {
      dispatch(setConnectionStatus(`error: ${error.message}`));
    });

    socket.on('f9rHIhOQDnfdAljB7jIlF8UjwsW2/sensorData', (data) => {
      dispatch(updateSensorData(data));
    });

    return true;
  }
);

// Async thunk for disconnecting socket
export const disconnectSocket = createAsyncThunk(
  'websocket/disconnect',
  async () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return true;
  }
);

// Async thunk for emitting events
export const emitSocketEvent = createAsyncThunk(
  'websocket/emit',
  async ({ event, data }) => {
    if (socket) {
      socket.emit(event, data);
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
      .addCase(initializeSocket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeSocket.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeSocket.rejected, (state, action) => {
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