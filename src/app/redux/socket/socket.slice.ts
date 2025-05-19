import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Room {
  _id: string;
  name: string;
  status: string;
  players: { id: number; name: string }[];
  maxPlayers: number;
  currentPlayers: number;
}

export interface SocketState {
  room: string;
  sockets: string[];
  rooms: Room[];
}

const initialState = {
  room: "",
  sockets: [],
  rooms: [],
} as SocketState;

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<string>) => {
      // console.log("Reducer called with:", action.payload);
      state.room = action.payload;
    },

    setSockets: (state, action: PayloadAction<string[]>) => {
      state.sockets = [...action.payload];
    },

    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action: PayloadAction<Room>) => {
      // state.rooms.push(action.payload);
      state.rooms = [...state.rooms, action.payload];
      console.log("Adding room:", action.payload);
    },
  },
  extraReducers: (builder) => {
    // Add any additional reducers here if needed
  },
});

export const { setRoom, setSockets, setRooms, addRoom } = socketSlice.actions;

export default socketSlice.reducer;
